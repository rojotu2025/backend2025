const express = require("express");
const { authUserC, recuperarContrasenaC, cambiarContrasenaC, reportUsuariosC, reportPedidosC, tabPedidosC, reportZonasC, reportLogsC, userHasIdentityC, userHasChangedIdentityC} = require("../../api/controllers/controller.user");
const { validateTokenC } = require("../controllers/controller.auth");
const routers = express.Router();
const bodyParser = require('body-parser');
const { guardarPedidoC, enviarPedidoC, buscarPedidoC } = require("../controllers/controller.pedido");
const { listarPrendasC, listarPrendasFrontC, buscarPrendasOutfitC } = require("../controllers/controller.prendas");

routers.get("/", (_req, res) => {
    res.status(200).json({ message: 'Raiz del API', code: 200, data: {}, error: false })
})

routers.post('/authUser', bodyParser.json(), authUserC)
routers.post('/validarIdentidad', bodyParser.json(), userHasIdentityC)
routers.post('/cambiarIdentidad', bodyParser.json(), userHasChangedIdentityC)
routers.post('/validateToken', bodyParser.json(), validateTokenC)
routers.post('/cambiarContrasena', bodyParser.json(), cambiarContrasenaC)
routers.post('/solicitarCodigo', bodyParser.json(), recuperarContrasenaC)

routers.post('/reportLogs', bodyParser.json(), reportLogsC)
routers.post('/reportUsuarios', bodyParser.json(), reportUsuariosC)
routers.post('/tabPedidos', bodyParser.json(), tabPedidosC)
routers.post('/reportZonas', bodyParser.json(), reportZonasC)

routers.post('/listarPrendas', bodyParser.json(), listarPrendasC)
routers.post('/listarOutfitsFront', bodyParser.json(), listarPrendasFrontC)
routers.post('/buscarPrendasOutfit', bodyParser.json(), buscarPrendasOutfitC)

routers.post('/buscarPedido', bodyParser.json(), buscarPedidoC)
routers.post('/guardarPedido', bodyParser.json(), guardarPedidoC)
routers.post('/enviarPedido', bodyParser.json(), enviarPedidoC)

module.exports = routers;