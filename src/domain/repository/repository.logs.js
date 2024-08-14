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

        const result = {};
        logsCount.forEach(log => {
            const { count, sucursal, genero, primer_ingreso, pais } = log;
            
            if (!result[pais]) {
                result[pais] = {};
            }
            
            if (!result[pais][sucursal]) {
                result[pais][sucursal] = {
                    totals: {
                        ingresos: 0,
                        no_ingresos: 0
                    },
                    list: []
                };
            }
            
            result[pais][sucursal].list.push({
                count,
                sucursal,
                genero,
                ingresos: primer_ingreso,
            });
            
            if (primer_ingreso==0) {
                result[pais][sucursal].totals.ingresos += count;
            } else {
                result[pais][sucursal].totals.no_ingresos += count;
            }
        });
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

        const totalLogs = await db.logs.count({
            attributes: [
                [sequelize.literal(`COUNT(id)`), 'count']
            ],
            raw: true,
        })

        return {
            detalle: logsCount,
            total: totalLogs
        };
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
        let total_carritos_enviados = 0;
        let total_carritos_no_enviados = 0;

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
                total_carritos_enviados += count;
            } else {
                sucursalData.carritos_no_enviados += count;
                total_carritos_no_enviados += count;
            }
        });

        return { result, total_carritos_enviados, total_carritos_no_enviados }
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = { reportLogsUsersR, reportLogsDayUsersR, reportLogsCartsR };