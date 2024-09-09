const { buscarCarritoS, quitarPrendaS, agregarPrendaS, enviarCarritoS } = require("../../domain/service/service.carrito");
const { userS } = require("../../domain/service/service.user");

/** POST Methods */
/**
 * @openapi
 * '/api/buscarCarrito':
 *  post:
 *     tags:
 *     - Carrito Controller
 *     summary: Buscar un carrito
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: string
 *            required:
 *              - token
 *            properties:
 *              username:
 *                type: string
 *                default: abc6e33b358d2ccf7dc99badf7e
 *     responses:
 *      201:
 *          code: 200
 *          message: "Exito!",
 *           data: {}
 *        description: Exito!
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
const buscarCarritoC = async (req, res) => {
    if (req.header("token")) {
        const response = await buscarCarritoS(req);
        return res.status(response.code).json(response)
    } else {
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
            const response = await agregarPrendaS(req, id_prenda, talla, dia);
            return res.status(response.code).json(response)
        } else {
            const response = await agregarPrendaS(req, id_prenda, talla);
            return res.status(response.code).json(response)
        }
    } else {
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: []
        }
        return res.status(response.code).json(response);
    }

}

const quitarPrendaC = async (req, res) => {
    const { id_prenda } = req.body;
    if (req.header("token") && id_prenda) {
        const response = await quitarPrendaS(req, id_prenda);
        return res.status(response.code).json(response)
    } else {
        let response = {
            code: 400,
            message: "Faltan campos!",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

const enviarCarritoC = async (req, res) => {
    if (req.header("token")) {
        const response = await enviarCarritoS(req);
        return res.status(response.code).json(response)
    } else {
        let response = {
            code: 400,
            message: "Faltan token de autenticacion!",
            data: []
        }
        return res.status(response.code).json(response);
    }

}

const validarEstadoPedidoC = async (req, res) => {
    const response = await userS(req);
    return res.status(response.code).json(response)
}

module.exports = { validarEstadoPedidoC, enviarCarritoC, buscarCarritoC, agregarPrendaC, quitarPrendaC };
