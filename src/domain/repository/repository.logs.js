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
            group: ["sucursal", "genero", "primer_ingreso", "pais"],
            raw: true,
        })

        // Procesar los datos
        const result = {};
        logsCount.forEach(log => {
            const { count, sucursal, genero, primer_ingreso, pais } = log;
            
            if (!result[pais]) {
                result[pais] = {};
            }
            
            if (!result[pais][sucursal]) {
                result[pais][sucursal] = {
                    totals: {
                        carrito_enviado: 0,
                        carrito_no_enviado: 0
                    },
                    list: []
                };
            }
            
            result[pais][sucursal].list.push({
                count,
                sucursal,
                genero,
                carrito_enviado: primer_ingreso // Asumimos que primer_ingreso es equivalente a carrito_enviado
            });
            
            if (primer_ingreso) {
                result[pais][sucursal].totals.carrito_enviado += count;
            } else {
                result[pais][sucursal].totals.carrito_no_enviado += count;
            }
        });
        console.log(result);

        return result
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
            group: ["sucursal", "genero", "carrito_enviado", "pais"],
            raw: true,
        })
                // Procesar los datos
        const result = {};
        logsCount.forEach(log => {
            const { count, sucursal, genero, carrito_enviado, pais } = log;
            
            if (!result[pais]) {
                result[pais] = [];
            }
            
            let sucursalData = result[pais].find(s => s.sucursal === sucursal);
            if (!sucursalData) {
                sucursalData = {
                    sucursal,
                    carritos_no_enviados: 0,
                    carritos_enviados: 0,
                    datos: []
                };
                result[pais].push(sucursalData);
            }
            
            sucursalData.datos.push({
                count,
                genero,
                carritos_enviado: carrito_enviado
            });
            
            if (carrito_enviado) {
                sucursalData.carritos_enviados += count;
            } else {
                sucursalData.carritos_no_enviados += count;
            }
        });
        console.log(logsCount);
        return result
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = { reportLogsUsersR, reportLogsDayUsersR, reportLogsCartsR };