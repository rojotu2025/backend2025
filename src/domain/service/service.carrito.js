const { buscarCarritoR, actualizarCarritoR, quitarPrendaR, agregarPrendaR } = require("../repository/repository.carrito.js");
const { searchUserR } = require('../repository/repository.user.js');
const { authS, decode } = require('./service.auth.js');
const { mailPedidoS } = require('./service.user.js');
const {v4:uuidv4} = require('uuid');

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
            response.data = carrito,
            response.token = usuario.token;
        }

    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const agregarPrendaS = async (req, id_prenda, talla) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = await authS(req.header("token"));
    const d = await decode(req.header("token"));
    if ((isValid).code == 200) {
        const usuario = isValid;
        const id_prenda_carrito = uuidv4();
        const pedido = await agregarPrendaR(d.usuario , id_prenda, id_prenda_carrito, talla);
        if (pedido) {
            response.code = 200
            response.message = "autorizado"
            response.data = "Exito"
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "Error al guardar!"
            response.data = "Ha ocurrido un error"
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}

const quitarPrendaS = async (req, id_prenda, id_prenda_carrito) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = await authS(req.header("token"));
    const d = await decode(req.header("token"));
    if ((isValid).code == 200) {
        const usuario = isValid;
        const pedido = await quitarPrendaR(d.usuario, id_prenda, id_prenda_carrito);
        if (pedido) {
            response.code = 200
            response.message = "autorizado"
            response.data = "Exito"
            response.token = usuario.token;
        } else {
            response.code = 200
            response.message = "Error!"
            response.data = "No se ha encontrado la prenda"
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}

module.exports = { agregarPrendaS, quitarPrendaS, buscarCarritoS }