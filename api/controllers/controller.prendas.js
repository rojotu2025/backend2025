const { listarPrendasS, listarPrendasFrontS, buscarPrendasOutfitS} = require("../../domain/service/service.prendas");

const listarPrendasC = async (req, res) => {
    const response = await listarPrendasS(req.header("token"), req.body.genero,req.body.rol, req.body.clima, req.body.grupo, req.body.pais, req.body.identidad );
    return res.status(response.code).json(response)
}

const buscarPrendasOutfitC= async (req, res) => {
    const ref_superior = req.body.referencia_prenda_superior;
    const ref_inferior = req.body.referencia_prenda_inferior;
    const ref_chaqueta = req.body.referencia_chaqueta;

    const response = await buscarPrendasOutfitS(req.header("token"), ref_superior, ref_inferior, ref_chaqueta);
    return res.status(response.code).json(response)
}

module.exports = { listarPrendasC, buscarPrendasOutfitC };