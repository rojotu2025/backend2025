const bcrypt = require('bcrypt');
const db = require("../model/index.js");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const updateUserPedidoR = async (userS, pedidoT) => {
    const date = new Date();
    try {
        const usuario = await db.usuario.findOne({
            where: {
                usuario: userS
            }
        });

        const pedido = await db.pedido.findOne({
            where: {
                usuario: userS,
            }
        });
        
        if(pedido){
            if (pedido.estado_pedido == "enviado") {
                return false
            } else {
                return await db.pedido.update(
                    {   
                        usuario: userS,
                        pedido: pedidoT,
                        fecha_actualizacion: date.getTime(),
                    },
                    {
                        where: {
                            usuario: userS
                        }
                    });
            }
        }else{
            return await db.pedido.create(
                {
                    usuario: userS,
                    pedido: pedidoT,
                    estado_pedido: "creado",
                    fecha_solicitud: date.getTime(),
                    fecha_actualizacion: date.getTime()
                });
        }
    } catch (error) {
        return false
    }
}

const updateUserIdentityR = async (userS, identidad) => {
    try {
        const usuario = await db.usuarios.findOne({
            where: {
                usuario: userS
            }
        });

        if (usuario) {
            return await db.usuarios.update(
                {
                    identidad: identidad
                },
                {
                    where: {
                        usuario: userS
                    }
                });
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const logsLogIn = async (userS) => {
    try {
        return await db.logs.create(
            {
                usuario: userS,
            })
    } catch (error) {
        return false
    }
}

const searchUserR = async (userS) => {
    try {
        const user = await db.usuarios.findOne({
            where: {
                usuario: userS
            }
        });
        if (user.usuario) {
            const limites = await buscarLimitesR(user.pais, user.genero, user.rol, user.clima, user.grupo);
            const hashedPass = await bcrypt.hash(user.contrasena, 8);
            return {
                user: user.usuario,
                nombre: user.nombre_colaborador,
                password: hashedPass,
                clima: user.clima,
                grupo: user.grupo,
                rol: user.rol,
                genero: user.genero,
                pais: user.pais,
                identidad:user.identidad,
                prendas_superiores: limites[0].prendas_superiores,
                prendas_inferiores: limites[0].prendas_inferiores,
                prendas_otros: limites[0].prendas_otros,
                total: limites[0].total,
                url_3d: limites[0].url_3d,
                correo: user.correo,
                primer_ingreso: user.primer_ingreso,
                administrador: user.administrador
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const buscarLimitesR = async (pais, genero, rol, clima, grupo) => {
    pais = pais.toLowerCase()

    try {
        const rols = await db.roles.findAll({
            where: {
                clima: {
                    [Op.substring]: clima
                },
                genero: {
                    [Op.substring]: genero
                },
                rol: {
                    [Op.substring]: rol
                },
                grupo: {
                    [Op.substring]: grupo
                },
                pais: {
                    [Op.substring]: pais
                }
            }
        });
        return rols
    } catch (error) {
        return false
    }
}

const tabPedidosR = async () => {
    try {
        const orderAttributes = ['usuario', 'pedido'];
        const userAttributes = ['nro_documento', 'nombre_colaborador', 'correo', 'unidad_negocio', 'ciudad', 'sucursal', 'pais'];

        let orders =
            await db.pedido.findAll({
                attributes: orderAttributes,
                where: {
                    estado_pedido: "enviado"
                },
                // group: ["usuario"],
                raw: true
            })
        let orderByUser = orders.map(order => order?.usuario);
        let userInfo = {}
        const users = await db.usuario.findAll({
            attributes: userAttributes,
            where: {
                correo: orderByUser
            },
            raw: true
        });
        users.map(user => userInfo[user.correo] = user);

        let data = []
        for (const order of orders) {
            data.push({
                ...order,
                usuario: userInfo[order.usuario]
            })
        }
        return data;
    } catch (error) {
        return false
    }
}

const reportLogsR = async () => {
    try {
        const logs = await db.logs.findAll();
        const logsCount = await db.logs.count({
            attributes: [
                [sequelize.literal(`DATE("createdAt")`), 'date'],
                [sequelize.literal(`COUNT(*)`), 'count']
            ],
            group: ['date'],
        })
        return {
            logsCount,
            logs
        }
    } catch (error) {
        return false
    }
}

const reportZonasR = async () => {
    try {
        const orderAttributes = ['usuario'];
        const userAttributes = ['correo', 'pais', 'ciudad'];

        let orders =
            (await db.pedido.findAll({
                attributes: orderAttributes,
                where: {
                    estado_pedido: "enviado"
                },
                // group: ["usuario"],
                raw: true
            })).map(order => order?.usuario);

        const users = await db.usuario.findAll({
            attributes: userAttributes,
            where: {
                correo: orders
            },
            raw: true
        });

        let countByCountry = {};
        users.map(user => {
            countByCountry[user.pais] = {
                city: user.ciudad,
                county: user.pais,
                count: countByCountry[user.pais]?.count ? countByCountry[user.pais].count + 1 : 1
            }
        })
        return countByCountry;

    } catch (error) {
        return false
    }
}

const reportUsuariosR = async () => {
    let report_usuarios = {
        usuarios_totales: 0,
        usuarios_sesion_iniciada: 0,
        pedidos_enviados: 0,
        pedidos_pendientes: 0,
        usuarios_pedido_enviado: {}
    }

    try {
        const orderAttributes = ['usuario'];
        const userAttributes = ['nro_documento', 'nombre_colaborador', 'correo', 'unidad_negocio', 'pais', 'sucursal'];
        let orders =
            (await db.pedido.findAll({
                attributes: orderAttributes,
                where: {
                    estado_pedido: "enviado"
                },
                raw: true
            })).map(order => order?.usuario);

        const users = await db.usuario.findAll({
            attributes: userAttributes,
            where: {
                correo: orders
            },
            raw: true
        });

        //Count usuarios que han iniciado sesion
        const countPedidosPendientes = await db.pedido.count(
            {
                where: {
                    estado_pedido: "pendiente"
                }
            }
        );

        //Count usuarios que han iniciado sesion
        const countSesionIniciada = await db.usuario.count(
            {
                where: {
                    primer_ingreso: false
                }
            }
        );
        //Count usuarios que han iniciado sesion
        const countUsuarios = await db.usuario.count();

        //Count pedidos enviados
        const countPedidosEnviados = await db.pedido.count(
            {
                where: {
                    estado_pedido: "enviado"
                }
            }
        );

        report_usuarios.usuarios_sesion_iniciada = countSesionIniciada;
        report_usuarios.usuarios_totales = countUsuarios;
        report_usuarios.pedidos_enviados = countPedidosEnviados;
        report_usuarios.pedidos_pendientes= countPedidosPendientes;
        report_usuarios.usuarios_pedido_enviado = users;
        return report_usuarios;
    } catch (error) {
        return false
    }
}

const cambiarContrasenaR = async (usuario, nueva_contrasena) => {
    const user = await db.usuarios.findOne({
        where: {
            usuario: usuario
        }
    });

    try {
        if (user.primer_ingreso == true) {
            await db.usuarios.update(
                {
                    primer_ingreso: false,
                },
                {
                    where: {
                        usuario: usuario
                    }
                })
        }
    } catch (error) {
        return false
    }

    return await db.usuarios.update(
        {
            contrasena: nueva_contrasena,
        },
        {
            where: {
                usuario: usuario
            }
        });
}

module.exports = { searchUserR, cambiarContrasenaR, logsLogIn, reportUsuariosR, tabPedidosR, reportZonasR, reportLogsR, updateUserIdentityR, updateUserPedidoR }