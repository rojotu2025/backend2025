const { listarPrendasS, buscarPrendaS } = require("../../domain/service/service.prendas");

const listarPrendasC = async (req, res) => {
    const { tipo } = req.body;
    if (req.header("token")) {
        if (tipo) {
            const response = await listarPrendasS(req.header("token"), tipo );
            return res.status(response.code).json(response);
        } else {
            let response = {
                code: 400,
                message: "Faltan campos!",
                data: []
            }
            return res.status(response.code).json(response);
        }
    }else{
        let response = {
            code: 400,
            message: "Faltan token de autenticación",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

const buscarPrendaC = async (req, res) => {
    const { id_prenda } = req.body;
    if (req.header("token")) {

        if (id_prenda) {
            const response = await buscarPrendaS(req.header("token"), id_prenda);
            return res.status(response.code).json(response)
        }else{
            let response = {
                code: 400,
                message: "Faltan campos!",
                data: "Error!"
            }
            return res.status(response.code).json(response)
        }
    }else{
        let response = {
            code: 400,
            message: "Faltan token de autenticación",
            data: "Error!"
        }
        return res.status(response.code).json(response)
    }
}

module.exports = { listarPrendasC, buscarPrendaC };