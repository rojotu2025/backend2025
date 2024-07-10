const { guardarPedidoS, enviarPedidoS, buscarPedidoS } = require("../../domain/service/service.pedidos");
const { userS } = require("../../domain/service/service.user");

const guardarPedidoC = async (req, res) => {
    const response = await guardarPedidoS(req);
    return res.status(response.code).json(response)
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

module.exports = { guardarPedidoC , validarEstadoPedidoC, enviarPedidoC, buscarPedidoC };