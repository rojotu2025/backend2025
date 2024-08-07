const db = require("../model/index.js");
const { Op } = require('sequelize');
const { buscarCarritoUsuarioR, buscarParametrosUsuarioR, buscarEstadoCarritoR, reportUsuariosR } = require("../repository/repository.user.js");
const { listarPrendasCarritoR } = require("./repository.prendas.js");

const buscarCarritoR = async (usuario) => {
    try {
        const prendasMap = {}
        const carrito_id = await buscarEstadoCarritoR(usuario);
        const usuario_params = await buscarParametrosUsuarioR(usuario);
        const { genero, rol, clima, grupo, pais, identidad } = usuario_params;
        const prendas_db = await listarPrendasCarritoR(genero, rol, clima, grupo, pais, identidad)

        prendas_db.map((prenda) => prendasMap[prenda.id] = prenda)

        let carrito = await db.carrito_prendas.findAll({
            where: {
                id_carrito: carrito_id.id
            },
            raw: true
        })

        for (const item_carrito of carrito) {
            item_carrito['prenda'] = prendasMap[item_carrito.id_prenda]
        }

        return { carrito, 'estado': carrito_id.estado_carrito }
    } catch (error) {
        console.log(error);
        return false
    }
}

const agregarPrendaR = async (usuario, id_prenda, talla, dia) => {
    try {
        const carrito_id = await buscarCarritoUsuarioR(usuario);
        const id = await createCarritoR(carrito_id, usuario);
        return await db.carrito_prendas.bulkCreate
            (
                [
                    {

                        id_carrito: id,
                        id_prenda: id_prenda,
                        talla: talla,
                        dia: dia
                    },
                ],
                { updateOnDuplicate: ['talla', 'dia'] },
            )

    } catch (error) {
        return false;
    }
}

const createCarritoR = async (carrito_id, usuario) => {
    const date = new Date();
    let id;
    if (!carrito_id) {
        const carrito = await db.carritos.create(
            {
                usuario: usuario,
                estado_carrito: "creado",
                fecha_solicitud: date.getTime(),
                fecha_actualizacion: date.getTime()
            });
        id = carrito.id
    } else {
        id = carrito_id
    }
    return id
}

const createCarritoUsuarioR = async (carrito_id, usuario) => {
    const date = new Date();
    let id;
    if (!carrito_id) {
        const carrito = await db.carritos.create(
            {
                usuario: usuario,
                estado_carrito: "creado",
                fecha_solicitud: date.getTime(),
                fecha_actualizacion: date.getTime()
            });
        id = carrito.id
    } else {
        id = carrito_id
    }
    return id
}

const quitarPrendaR = async (usuario, id_prenda) => {
    try {
        const carrito_id = await buscarCarritoUsuarioR(usuario);
        return await db.carrito_prendas.destroy({
            where: {
                id_carrito: carrito_id,
                id_prenda: id_prenda
            }
        });
    } catch (error) {
        return false;
    }
}

const enviarCarritoR = async (usuarioT) => {
    try {
        const date = new Date();
        const estado_carrito = await buscarEstadoCarritoR(usuarioT)
        if (estado_carrito.estado_carrito == "enviado") {
            return false
        } else {
            const logged = await db.logs.update(
                {
                    carrito_enviado: true
                },
                {
                    where: {
                        usuario: usuarioT,
                    }
                })

            const updated = await db.carritos.update(
                {
                    fecha_actualizacion: date.getTime(),
                    estado_carrito: "enviado"
                },
                {
                    where: {
                        usuario: usuarioT,
                    }
                })

            if (logged && updated) {
                return true
            } else {
                return false
            }
        }
    } catch (error) {
        console.log(error);
        return false
    }

}

module.exports = { buscarCarritoR, agregarPrendaR, quitarPrendaR, createCarritoR, enviarCarritoR }