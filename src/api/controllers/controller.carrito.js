const { enviarPedidoS, buscarPedidoS } = require("../../domain/service/service.pedidos");
const { buscarCarritoS, quitarPrendaS, agregarPrendaS } = require("../../domain/service/service.carrito");
const { userS } = require("../../domain/service/service.user");

const buscarCarritoC = async (req, res) => {
    if (req.header("token")) {
        const response = await buscarCarritoS(req);
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: "Error!"
        }
        return res.status(response.code).json(response)
    }
}

const agregarPrendaC = async (req, res) => {
    let { id_prenda, talla, cantidad } = req.body;
    if (req.header("token") && id_prenda && talla, cantidad) {
        const response = await agregarPrendaS(req, id_prenda, talla, cantidad );
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: "Error!"
        }
        return res.status(response.code).json(response)
    }

}

const quitarPrendaC = async (req, res) => {
    const { id_prenda, id_prenda_carrito } = req.body;
    if (req.header("token") && id_prenda && id_prenda_carrito ) {
        const response = await quitarPrendaS(req, id_prenda, id_prenda_carrito);
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: "Error!"
        }
        return res.status(response.code).json(response)
    }
}

const enviarPedidoC = async (req, res) => {
    const response = await enviarPedidoS(req);
    return res.status(response.code).json(response)
}

const buscarPedidoC = async (req, res) => {
    const response = await buscarPedidoS(req);
    return res.status(response.code).json(response)
}

const validarEstadoPedidoC = async (req, res) => {
    const response = await userS(req);
    return res.status(response.code).json(response)
}

module.exports = { validarEstadoPedidoC, enviarPedidoC, buscarCarritoC, agregarPrendaC, quitarPrendaC };