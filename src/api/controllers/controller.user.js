const { authUserS, recuperarContrasenaS, cambiarContrasenaS, agregarCorreoS, reportPedidosS, tabPedidosS, reportZonasS, reportUsuariosS, reportLogsS, userHasIdentityS, userHasChangedIdentityS } = require("../../domain/service/service.user");

const authUserC = async (req, res) => {
    const response = await authUserS(req, res);
    res.status(response.code).json(response)
}

/** Cambia si usurario ha registrado identidad de genero */
const userHasChangedIdentityC = async (req, res) => {
    const response = await userHasChangedIdentityS(req, res);
    res.status(response.code).json(response)
}

/** Lista los usuarios que han enviado su coleccion */
const reportZonasC = async (req, res) => {
    const response = await reportZonasS(req, res);
    res.status(response.code).json(response)
}

/** Lista los usuarios que han enviado su coleccion */
const reportLogsC = async (req, res) => {
    const response = await reportLogsS(req, res);
    res.status(response.code).json(response)
}

/** Lista los usuarios que han enviado su coleccion */
const reportUsuariosC = async (req, res) => {
    const response = await reportUsuariosS(req, res);
    res.status(response.code).json(response)
}

/**Lista los usuarios que han enviado su coleccion */
const tabPedidosC= async (req, res) => {
    const response = await tabPedidosS(req, res);
    res.status(response.code).json(response)
}

const agregarCorreoC = async (req, res) => {
    const response = await agregarCorreoS(req, res);
    res.status(response.code).json(response)
}

const recuperarContrasenaC = async (req, res) => {
    const response = await recuperarContrasenaS(req, res);
    res.status(response.code).json(response)
}

const cambiarContrasenaC = async (req, res) => {
    const response = await cambiarContrasenaS(req, res);
    res.status(response.code).json(response)
}

module.exports = { authUserC, recuperarContrasenaC, cambiarContrasenaC, agregarCorreoC, reportUsuariosC, tabPedidosC, reportZonasC, reportLogsC, userHasChangedIdentityC};