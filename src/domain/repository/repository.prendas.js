const { Op } = require("sequelize");
const db = require("../model/index.js");

const listarPrendasR = async (genero, rol, clima, grupo, pais, identidad, tipo) => {
    tipo = tipo.toUpperCase()
    genero = genero.toUpperCase()
    grupo = grupo.toUpperCase()
    pais = pais.toUpperCase()
    clima = clima.toUpperCase()
    rol = rol.toUpperCase()
    try {
        const prendas = await db.prendas.findAll({
            where: {
                tipo: {
                    [Op.substring]: tipo
                },
                clima: {
                    [Op.substring]: clima
                },
                genero: genero,
                rol: {
                    [Op.substring]: rol
                },
                pais: {
                    [Op.substring]: pais
                },
                grupo: {
                    [Op.substring]: grupo
                },
            },
            raw: true
        })
        if (tipo.toUpperCase() == "LOOKBOOK") {
            var arrLunes = []
            var arrMartes = []
            var arrMiercoles = []
            var arrJueves = []
            var arrViernes = []
            var defaultDay = []
            prendas.forEach(prenda => {
                prenda.tipo = "LOOKBOOK"
                switch (prendas.dias) {
                    case "LUNES":
                        arrLunes.push(prenda)
                        break;

                    case "MARTES":
                        arrMartes.push(prenda)
                        break;

                    case "MIERCOLES":
                        arrMiercoles.push(prenda)
                        break;

                    case "JUEVES":
                        arrJueves.push(prenda)
                        break;

                    case "VIERNES":
                        arrViernes.push(prenda)
                        break;

                    default:
                        defaultDay.push(prenda)
                        break;
                }
            });
            return [...arrLunes, ...arrMartes, ...arrMiercoles, ...arrJueves, ...arrViernes, ...defaultDay]
        }

        if (tipo.toUpperCase() == "OUTFIT") {
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

        if (prendas == []) {
            return false
        }

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
        raw: true
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


        if (prenda.tipo.toUpperCase() == "LOOKBOOK") {
            prenda.tipo = "LOOKBOOK"
        }

        if (prenda.tipo.toUpperCase() == "OUTFIT") {
            prenda.tipo = "OUTFIT"
        }

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
        if (prenda == null) {
            return false
        }
        return prenda;
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports = { listarPrendasR, buscarPrendaR, listarPrendasCarritoR }