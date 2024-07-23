const { buscarCarritoR, actualizarCarritoR, quitarPrendaR, agregarPrendaR } = require("../repository/repository.carrito.js");
const { searchUserR } = require('../repository/repository.user.js');
const { authS, decode } = require('./service.auth.js');
const { mailPedidoS } = require('./service.user.js');

const buscarCarritoS = async (req, res) => {
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
        const carrito = await buscarCarritoR(d.usuario);

        if (carrito) {
            response.code = 200
            response.message = "autorizado"
            response.data = carrito
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "No se ha encontrado un carrito con este usuario!"
            response.data = []
            response.token = usuario.token;
        }

    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
        response.data = []
    }
    return response
}

const agregarPrendaS = async (req, id_prenda, talla, dia) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = await authS(req.header("token"));
    const d = await decode(req.header("token"));
    if ((isValid).code == 200) {
        const usuario = isValid;
        const prenda = await agregarPrendaR(d.usuario, id_prenda, talla, dia);
        if (prenda) {
            response.code = 200
            response.message = "autorizado"
            response.data = prenda
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "Error al guardar!"
            response.data = []
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
        response.data = []
    }

    return response
}

const quitarPrendaS = async (req, id_prenda) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = await authS(req.header("token"));
    const d = await decode(req.header("token"));
    if ((isValid).code == 200) {
        const usuario = isValid;
        const pedido = await quitarPrendaR(d.usuario, id_prenda);
        if (pedido) {
            response.code = 200
            response.message = "autorizado"
            response.data = "Exito"
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "Error! No se ha encontrado la prenda!"
            response.data = []
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
        response.data = []
    }

    return response
}

module.exports = { agregarPrendaS, quitarPrendaS, buscarCarritoS }