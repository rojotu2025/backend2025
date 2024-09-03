const { reportLogsUsersR, reportLogsDayUsersR, reportLogsCartsR } = require("../repository/repository.logs");
const { searchUserR } = require("../repository/repository.user.js");
const { authS, decode } = require('./service.auth.js');

// 3 .kpi de ingreso de personas que han ingresaso y quienes no, separado por hombre, mujere y sede
const reportLogsUsersS = async (token) => {
    let response = {
        code: "",
        message: "",
        data: [],
        token: ""
    }
    try {
        const isValid = await authS(token);
        const user = await searchUserR(isValid.data.usuario);
        if ((isValid).code == 200 && user.dashboard == true) {
            const usuario = isValid;
            const Logs = await reportLogsUsersR();
            if (Logs) {
                response.code = 200;
                response.message = "Exito!";
                response.data =  Logs;
                response.token = usuario.token;
            } else {
                response.code = 404;
                response.message = "No se han encontrado estadisticas para mostrar!";
                response.data = [];
                response.token = usuario.token;
            }
        } else {
            response.code = 403
            response.message = "No autorizado o sesion expirada!"
            response.data = []
        }
    } catch (error) {
        console.log(error);
        response.code = 400
        response.message = "Ha ocurrido un error al buscar las estadisticas!"
        response.data = []
        response.token = token;
    }
    return response
}

// 1, kpi de ingreso de personal por dia
const reportLogsDayUsersS = async (token) => {
    let response = {
        code: 400,
        message: "",
        data: [],
        token: ""
    }
    try {
        const isValid = await authS(token);
        const user = await searchUserR(isValid.data.usuario);
        if ((isValid).code == 200 && user.dashboard == true) {
            const usuario = isValid;
            const logs = await reportLogsDayUsersR();
            if (logs) {
                response.code = 200;
                response.message = "Exito!";
                response.data =  logs;
                response.token = usuario.token;
            } else {
                response.code = 404;
                response.message = "No se han encontrado estadisticas para mostrar!";
                response.data = [];
                response.token = usuario.token;
            }
        } else {
            response.code = 403
            response.message = "No autorizado o sesion expirada!"
            response.data = []
        }
    } catch (error) {
        console.log(error);
        response.code = 400
        response.message = "Ha ocurrido un error al buscar las estadisticas!"
        response.data = []
        response.token = token;
    }
    return response
}

// 2, kpi de envio de carrito separado por hombre, mujere y sede
const reportLogsCartsS = async (token) => {
    let response = {
        code: 400,
        message: "",
        data: [],
        token: ""
    }
    const isValid = await authS(token);
    if ((isValid).code == 200 && isValid.data.administrador == true) {
        const usuario = isValid;
        try {
            const logs = await reportLogsCartsR();
            if (logs) {
                response.code = 200;
                response.message = "Exito!";
                response.data = logs;
                response.token = usuario.token;
            } else {
                response.code = 404;
                response.message = "No se han encontrado estadisticas para mostrar!";
                response.data = [];
                response.token = usuario.token;
            }
        } catch (error) {
            response.code = 400
            response.message = "Ha ocurrido un error al buscar las estadisticas!"
            response.data = []
            response.token = usuario.token;
        }

    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada!"
        response.data = []
    }
    return response
}

module.exports = { reportLogsUsersS, reportLogsDayUsersS, reportLogsCartsS };
