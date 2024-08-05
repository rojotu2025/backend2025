const bcrypt = require('bcrypt');
const db = require("../model/index.js");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const buscarCarritoUsuarioR = async (usuario) => {
    try {
        const carrito_usuario = await db.carritos.findOne({
            where: {
                usuario: usuario,
            },
            raw: true
        });

        if (!carrito_usuario) {
            return false
        }

        return carrito_usuario.id
    } catch (error) {
        return false
    }
}

const buscarEstadoCarritoR = async (usuario) => {
    try {
        const carrito_usuario = await db.carritos.findOne({
            where: {
                usuario: usuario,
            },
            raw: true
        });

        if (!carrito_usuario) {
            return false
        }

        return carrito_usuario
    } catch (error) {
        return false
    }
}

const buscarParametrosUsuarioR = async (usuario) => {
    try {
        const usuario_db = await db.usuarios.findOne({
            where: {
                usuario: usuario,
            },
            raw: true
        });

        if (!usuario_db) {
            return false
        }

        return usuario_db
    } catch (error) {
        return false
    }
}

const clearUserCarritoR = async (usuarioS) => {
    try {

        const carrito = await db.carritos.findOne({
            where: {
                usuario: usuarioS,
            }
        });

        if (carrito) {
            const carrito_id = await buscarCarritoUsuarioR(usuarioS);
            if (carrito.estado_carrito == "enviado") {
                return false
            } else {
                return await db.carrito_prendas.destroy(
                    {
                        where: {
                            id_carrito: carrito_id
                        }
                    });
            }
        } else {
            return false
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
    const userParams = await buscarParametrosUsuarioR(userS);
    try {
        if (!userParams.primer_ingreso) {
            return await db.usuarios.update(
                {
                    primer_ingreso: true
                },
                {
                    where: {
                        usuario: userS
                    }
                });
        }
        return await db.logs.create(
            {
                usuario: userS,
                ciudad: userParams.ciudad,
                sucursal: userParams.sucursal,
                pais: userParams.pais,
                genero: userParams.genero,
                identidad: userParams.identidad,
                rol: userParams.rol,
                clima: userParams.clima,
                grupo: userParams.grupo,
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
        console.log(userS);
        
        if (user.usuario) {
            const limites = await buscarLimitesR(user.pais, user.genero, user.rol, user.clima, user.grupo);
            const hashedPass = await bcrypt.hash(user.contrasena, 8);
            return {
                user: user.usuario,
                nombre: user.nombre,
                password: hashedPass,
                ciudad: user.ciudad,
                pais: user.pais,
                sucursal: user.sucursal,
                clima: user.clima,
                grupo: user.grupo,
                cargo: user.cargo,
                rol: user.rol,
                VP: user.VP,
                genero: user.genero,
                pais: user.pais,
                identidad: user.identidad,
                prendas_superiores: limites[0].prendas_superiores,
                prendas_inferiores: limites[0].prendas_inferiores,
                prendas_otros: limites[0].prendas_otros,
                total: limites[0].total,
                correo: user.correo,
                primer_ingreso: user.primer_ingreso,
                administrador: user.administrador
            }
        } else {
            return false
        }
    } catch (error) {
        console.log(error);

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
        report_usuarios.pedidos_pendientes = countPedidosPendientes;
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

module.exports = { searchUserR, cambiarContrasenaR, logsLogIn, reportUsuariosR, tabPedidosR, reportZonasR, reportLogsR, updateUserIdentityR, buscarCarritoUsuarioR, buscarParametrosUsuarioR, clearUserCarritoR, buscarEstadoCarritoR }