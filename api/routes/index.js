const express = require("express");
const { authUserC, recuperarContrasenaC, cambiarContrasenaC, reportUsuariosC, tabPedidosC, reportZonasC, reportLogsC, userHasChangedIdentityC} = require("../../api/controllers/controller.user");
const { validateTokenC } = require("../controllers/controller.auth");
const routers = express.Router();
const bodyParser = require('body-parser');
const { guardarPedidoC, enviarPedidoC, buscarPedidoC, buscarCarritoC, agregarPrendaC, quitarPrendaC } = require("../controllers/controller.carrito");
const { listarPrendasC, buscarPrendasOutfitC } = require("../controllers/controller.prendas");

routers.get("/", (_req, res) => {
    res.status(200).json({ message: 'Raiz del API', code: 200, data: {}, error: false })
})

/*Usuario*/
routers.post('/authUser', bodyParser.json(), authUserC)
routers.post('/validateToken', bodyParser.json(), validateTokenC)
routers.post('/actualizarIdentidad', bodyParser.json(), userHasChangedIdentityC)

/*Contraseña*/
routers.post('/cambiarContrasena', bodyParser.json(), cambiarContrasenaC)
routers.post('/solicitarCodigo', bodyParser.json(), recuperarContrasenaC)

/*Prendas*/
routers.post('/listarPrendas', bodyParser.json(), listarPrendasC)
routers.post('/buscarPrendasOutFit', bodyParser.json(), buscarPrendasOutfitC)

/*Carrito*/
routers.post('/buscarCarrito', bodyParser.json(), buscarCarritoC)   
routers.post('/agregarPrenda', bodyParser.json(), agregarPrendaC)
routers.post('/quitarPrenda', bodyParser.json(), quitarPrendaC)

/*
routers.post('/buscarPedido', bodyParser.json(), buscarPedidoC)
routers.post('/guardarPedido', bodyParser.json(), guardarPedidoC)
routers.post('/enviarPedido', bodyParser.json(), enviarPedidoC)
*/

/*Reportes*/
routers.post('/reportLogs', bodyParser.json(), reportLogsC)
routers.post('/reportUsuarios', bodyParser.json(), reportUsuariosC)
routers.post('/tabPedidos', bodyParser.json(), tabPedidosC)
routers.post('/reportZonas', bodyParser.json(), reportZonasC)

module.exports = routers;