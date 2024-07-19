const { listarPrendasR, buscarPrendaR} = require('../repository/repository.prendas.js');
const { searchUserR } = require("../repository/repository.user.js");
const { authS, decode } = require('./service.auth.js');

const listarPrendasS = async (token) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }
    const isValid = authS(token);
    if ((await isValid).code == 200) {
        const usuario = await isValid;
        const d = await decode(token);
        try {
            const usuarioBuscado = await searchUserR(d.usuario);
            console.log(usuarioBuscado);
            const prendas = await listarPrendasR(usuarioBuscado.genero, usuarioBuscado.rol, usuarioBuscado.clima, usuarioBuscado.grupo, usuarioBuscado.pais , usuarioBuscado.identidad);
            if (prendas) {
                response.code = 200;
                response.message = "Exito!";
                response.data = prendas;
                response.token = usuario.token;
            }else{
                response.code = 404
                response.message = "No se han encontrado lookbooks para este usuario"
                response.token = usuario.token;
            }
        } catch (error) {
            response.code = 400
            response.message = "Ha ocurrido un error al buscar los Lookbooks"
            response.data = error
            response.token = usuario.token;
        }

    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const buscarPrendaS = async (token, id_prenda) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = authS(token);
    if ((await isValid).code == 200) {
        const usuario = await isValid;
        try {
            const prenda = await buscarPrendaR(id_prenda); 
            response.code = 200;
            response.message = "Exito!";
            response.data = prenda;
            response.token = usuario.token;
        } catch (error) {
            response.code = 400;
            response.message = "Error!";
            response.data = error;
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}
  
module.exports = { listarPrendasS, buscarPrendaS }