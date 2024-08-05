const db = require("../model/index.js");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { sql } = require('sequelize');

// 3 .kpi de ingreso de personas que han ingresaso y quienes no, separado por hombre, mujere y sede
const reportLogsUsersR = async () => {
    try {
        const logsCount = await db.usuarios.count({
            attributes: [
                [sequelize.literal(`COUNT(id)`), 'count']
            ],
            group: ["sucursal", "genero", "primer_ingreso"],
            raw: true,
        })
        return logsCount
    } catch (error) {
        console.log(error);
        return false
    }
}

// 1, kpi de ingreso de personal por dia
const reportLogsDayUsersR = async () => {
    try {
        const logsCount = await db.logs.count({
            attributes: [
                [sequelize.literal(`DATE(createdAt)`), 'fecha'],
                [sequelize.literal(`COUNT(id)`), 'count']
            ],
            group: ["fecha", "sucursal", "genero"],
            raw: true,
        })
        return logsCount
    } catch (error) {
        console.log(error);
        return false
    }
}

// 2, kpi de envio de carrito separado por hombre, mujere y sede
const reportLogsCartsR = async () => {
    try {
        const logsCount = await db.logs.count({
            attributes: [
                [sequelize.literal(`COUNT(DISTINCT(usuario))`), 'count'],
            ],
            group: ["sucursal", "genero", "carrito_enviado"],
            raw: true,
        })
        return logsCount
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = { reportLogsUsersR, reportLogsDayUsersR, reportLogsCartsR };