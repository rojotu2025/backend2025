const db = require("../model/index.js");

const insertPedidoR = async (usuarioT, pedidoT) => {
    const date = new Date();
    const pedido = await db.pedido.findOne({
        where: {
            usuario: usuarioT,
        }
    });

    if (pedido) {
        if (pedido.estado_pedido == "enviado") {
            return false;
        } else {
            const pedido = await db.pedido.update(
                {
                    usuario: usuarioT,
                    pedido: pedidoT,
                    fecha_actualizacion: date.getTime(),
                    estado_pedido: "pendiente"
                },
                {
                    where: {
                        usuario: usuarioT,
                    }
                })
            return pedido;
        }
    } else {
        const pedido = await db.pedido.create(
            {
                usuario: usuarioT,
                pedido: pedidoT,
                estado_pedido: "creado",
                fecha_solicitud: date.getTime(),
                fecha_actualizacion: date.getTime()
            })
        return pedido;
    }
}

const enviarPedidoR = async (usuarioT, pedidoT) => {
    const date = new Date();
    const pedido = await db.pedido.findOne({
        where: {
            usuario: usuarioT,
        }
    });

    if (pedido) {
        if (pedido.estado_pedido == 'enviado') {
            return false;
        } else {
            const pedido = await db.pedido.update(
                {
                    usuario: usuarioT,
                    pedido: pedidoT,
                    fecha_actualizacion: date.getTime(),
                    estado_pedido: "enviado"
                },
                {
                    where: {
                        usuario: usuarioT,
                    }
                })
                return pedido;
        }
    } else {
        const pedido = await db.pedido.create(
            {
                usuario: usuarioT,
                pedido: pedidoT,
                estado_pedido: "enviado",
                fecha_solicitud: date.getTime(),
                fecha_actualizacion: date.getTime()
            })
            return pedido;
    }
}

const buscarPedidoR = async (usuario) => {
    try {
        return await db.pedido.findOne({
            where: {
                usuario: usuario,
            }
        });
    } catch (error) {
        console.log(error)
        return false;
    }
}

module.exports = { insertPedidoR, enviarPedidoR, buscarPedidoR }