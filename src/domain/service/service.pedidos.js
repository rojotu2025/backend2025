const { insertPedidoR, enviarPedidoR, buscarPedidoR, buscarCarritoR } = require('../repository/repository.pedido.js');
const { searchUserR } = require('../repository/repository.user.js');
const { authS, decode } = require('./service.auth.js');
const { mailPedidoS } = require('./service.user.js');


const guardarPedidoS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = await authS(req.header("token"));
    const d = await decode(req.header("token"));
    if ((isValid).code == 200) {
        const usuario = isValid;
        const pedido = await insertPedidoR(d.usuario, req.body.pedido);
        if (pedido) {
            response.code = 200
            response.message = "autorizado"
            response.data = "Exito"
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "autorizado"
            response.data = "Falló"
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}


const buscarPedidoS = async (req, res) => {

    let response = {
        code: "",
        message: "",
        data: "",
        token: ""
    }

    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200) {
        const d = await decode(req.header("token"));
        const usuario = isValid;
        const pedido = await buscarPedidoR(d.usuario);

        if (pedido) {
            response.code = 200
            response.message = "autorizado"
            response.data = pedido
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "No se encontraron pedidos con este usuario"
            response.data = pedido,
            response.token = usuario.token;
        }

    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

module.exports = { guardarPedidoS, buscarPedidoS }