const { Op } = require("sequelize");
const db = require("../model/index.js");
const { raw } = require("body-parser");
const { buscarParametrosUsuarioR } = require("./repository.user.js");

const listarPrendasR = async (genero, rol, clima, grupo, pais, identidad, tipo) => {

    const prendas = await db.prendas.findAll({
        where: {
            clima: {
                [Op.substring]: clima
            },
            genero: genero,
            identidad: identidad,
            rol: {
                [Op.substring]: rol
            },
            grupo: {
                [Op.substring]: grupo
            },
            pais: {
                [Op.substring]: pais
            },
            tipo: tipo
        },
        raw: true
    })

    return prendas;
}

const listarPrendasCarritoR = async (genero, rol, clima, grupo, pais, identidad) => {
    const prendas = await db.prendas.findAll({
        // where: {
        //     clima: {
        //         [Op.substring]: clima
        //     },
        //     genero: genero,
        //     identidad: identidad,
        //     rol: {
        //         [Op.substring]: rol
        //     },
        //     grupo: {
        //         [Op.substring]: grupo
        //     },
        //     pais: {
        //         [Op.substring]: pais
        //     },
        // },
        raw:true
    })

    return prendas;
}

const buscarPrendaR = async (id_prenda) => {
    try {
        const prenda = await db.prendas.findOne({
            where: {
                id: id_prenda,
            },
            raw: true
        });
        return prenda;
    } catch (error) {
        throw new Error(error);
    }

}

module.exports = { listarPrendasR, buscarPrendaR, listarPrendasCarritoR }