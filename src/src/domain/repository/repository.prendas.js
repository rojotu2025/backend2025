const { Op } = require("sequelize");
const db = require("../model/index.js");

const listarPrendasR = async (genero, rol , clima, grupo, pais, identidad) => {
    if(pais != "COLOMBIA"){
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
                pais: 'COLOMBIA Y FILIALES INTERNACIONALES'
            }
        })
        return prendas;
    }else{
        return await db.prendas.findAll({
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
                }
            }
        })
    }
}

const listarPrendasFrontR = async (genero, rol, clima, grupo, pais, identidad) => {
    if(pais != "COLOMBIA"){
        const outfits = await db.front_outfits.findAll({
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
                pais: 'FILIALES INTERNACIONALES'
            }
        })
        return outfits
    }else{
        const outfits = await db.front_outfits.findAll({
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
                pais: pais
            }
        });
        return outfits
    }
}

const buscarPrendasOutfitR = async (referencia) => {
    const p = await db.prendas.findOne({
        where: {
            referencia: referencia,
        }
    });
    return p;
}

module.exports = { listarPrendasR, listarPrendasFrontR, buscarPrendasOutfitR }