const { authS } = require("../../domain/service/service.auth");

const validateTokenC = async (req, res) => {
    const response = await authS(req.header("token"));
    return res.status(response.code).json(response)
}

module.exports = { validateTokenC };