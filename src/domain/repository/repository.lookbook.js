const { where } = require("sequelize");
const db = require("../model/index.js");

const listarLookbooksR= async (rol, clima, identidad, genero, grupo, pais) => {
    try {
        return await db.lookbooks.findAll({
            where:{
                rol:rol, 
                clima:clima, 
                identidad:identidad, 
                genero:genero, 
                grupo:grupo, 
                pais:pais
            }}
        );
    } catch (error) {
        return false;
    }
}

module.exports = { listarLookbooksR };