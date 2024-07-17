const { listarLookbooksS } = require("../../domain/service/service.lookbook");

const listarLookbooksC = async (req, res) => {
    if (req.header("token")) {
        const response = await listarLookbooksS(req);
        return res.status(response.code).json(response)
    }else{
        let response = {
            code: 400,
            message: "Faltan token de autenticación",
            data: "Error!"
        }
        return res.status(response.code).json(response)
    }
}

module.exports = { listarLookbooksC };