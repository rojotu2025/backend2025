const { reportLogsUsersS, reportLogsDayUsersS, reportLogsCartsDayS } = require("../../domain/service/service.logs");

const reportLogsDayUsersC = async (req, res) => {
    if (req.header("token")) {
            const response = await reportLogsDayUsersS(req.header("token"));
            return res.status(response.code).json(response);
    }else{
        let response = {
            code: 400,
            message: "Faltan token de autenticación",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

const reportLogsUsersC = async (req, res) => {
    let response = {
        code: 400,
        message: "Faltan token de autenticación",
        data: []
    }
    if (req.header("token")) {
            const response = await reportLogsUsersS(req.header("token"));
            return res.status(response.code).json(response)
    }else{
        response = {
            code: 400,
            message: "Faltan token de autenticación",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

const reportLogsCartsDayC = async (req, res) => {
    if (req.header("token")) {
            const response = await reportLogsCartsDayS(req.header("token"));
            return res.status(response.code).json(response);
    }else{
        let response = {
            code: 400,
            message: "Faltan token de autenticación",
            data: []
        }
        return res.status(response.code).json(response);
    }
}

module.exports = { reportLogsUsersC, reportLogsDayUsersC, reportLogsCartsDayC };