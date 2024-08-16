const { authS } = require("../../domain/service/service.auth");

const validateTokenC = async (req, res) => {
    if (req.header("token")) {
        const response = await authS(req.header("token"));
        return res.status(response.code).json(response)
    } else {
        let response = {
            code: 400,
            message: "Faltan token de autorizacion!",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

module.exports = { validateTokenC };