const { enviarPedidoS, buscarPedidoS } = require("../../domain/service/service.pedidos");
const { buscarCarritoS, quitarPrendaS, agregarPrendaS, enviarCarritoS } = require("../../domain/service/service.carrito");
const { userS } = require("../../domain/service/service.user");

const buscarCarritoC = async (req, res) => {
    if (req.header("token")) {
        const response = await buscarCarritoS(req);
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

const agregarPrendaC = async (req, res) => {
    let { id_prenda, talla, dia } = req.body;
    if (req.header("token") && id_prenda && talla) {
        if (dia) {
            const response = await agregarPrendaS(req, id_prenda, talla, dia );
            return res.status(response.code).json(response)
        }else{
            const response = await agregarPrendaS(req, id_prenda, talla );
            return res.status(response.code).json(response)
        }
    }else{
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: []
        }
        return res.status(response.code).json(response);
    }

}

const quitarPrendaC = async (req, res) => {
    const { id_prenda} = req.body;
    if (req.header("token") && id_prenda ) {
        const response = await quitarPrendaS(req, id_prenda);
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

const enviarCarritoC = async (req, res) => {
    if (req.header("token") ) {
        const response = await enviarCarritoS(req);
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan token de autenticacion!",
            data: []
        }
        return res.status(response.code).json(response);
    }

}

const buscarPedidoC = async (req, res) => {
    const response = await buscarPedidoS(req);
    return res.status(response.code).json(response)
}

const validarEstadoPedidoC = async (req, res) => {
    const response = await userS(req);
    return res.status(response.code).json(response)
}

module.exports = { validarEstadoPedidoC, enviarCarritoC, buscarCarritoC, agregarPrendaC, quitarPrendaC };
