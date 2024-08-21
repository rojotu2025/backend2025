const { Op } = require("sequelize");
const db = require("../model/index.js");
const { buscarParametrosUsuarioR } = require("./repository.user.js");

const listarPrendasR = async (genero, rol, clima, grupo, pais, identidad, tipo) => {
    try {

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
                tipo: {
                    [Op.substring]: tipo
                }
            },
            raw: true
        })

        if (tipo == "LOOKBOOK") {
            prendas.forEach(prenda => {
                prenda.tipo = "LOOKBOOK"
            });
        }

        if (tipo == "LOOKBOOK") {
            prendas.forEach(prenda => {
                prenda.tipo = "OUTFIT"
            });
        }

        prendas.forEach(prenda => {
            prenda['detalles'] = []
            if (prenda.detalle1 !== "") {
                prenda['detalles'].push({ 'detalle1': prenda.detalle1 })
                delete prenda.detalle1
            } else {
                delete prenda.detalle1
            }

            if (prenda.detalle2 !== "") {
                prenda['detalles'].push({ 'detalle2': prenda.detalle2 })
                delete prenda.detalle2
            } else {
                delete prenda.detalle2
            }

            if (prenda.detalle3 !== "") {
                prenda['detalles'].push({ 'detalle3': prenda.detalle3 })
                delete prenda.detalle3
            } else {
                delete prenda.detalle3
            }
        });
        return prendas;
    } catch (error) {
        console.log(error);
        return false
    }

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
