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
        },
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

const validateParamsPrendaR = async (usuario, id_prenda) => {
    const userParams = await buscarParametrosUsuarioR(usuario);
    const prendaParams = await buscarPrendaR(id_prenda);
    let error = false;
    const clima = prendaParams.clima;
    const rol = prendaParams.rol;
    const grupo = prendaParams.grupo;
    const genero = prendaParams.genero;
    const pais = prendaParams.pais;
    const identidad = prendaParams.identidad;

    if(!clima.includes(userParams.clima)){
        error = true;
    }

    if (!rol.includes(userParams.rol)) {
        error = true;
    }

    if (!grupo.includes(userParams.grupo)) {
        error = true;
    }

    if (!genero.includes(userParams.genero)) {
        error = true;
    }

    if (!pais.includes(userParams.pais)) {
        error = true;
    }

    if (!identidad.includes(userParams.identidad)) {
        error = true;
    }
    return true
    if (error == true) {
        return false
    }else{
        return true
    }

}

module.exports = { listarPrendasR, buscarPrendaR, listarPrendasCarritoR, validateParamsPrendaR }
