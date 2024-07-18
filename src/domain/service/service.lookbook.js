const { listarLookbooksR } = require("../repository/repository.lookbook");
const { searchUserR } = require("../repository/repository.user.js");
const { authS, decode } = require('./service.auth.js');

const listarLookbooksS = async (req) => {
    let response = {
        code: "",
        message: "",
        data: "",
        token: ""
    }

    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200) {
        const d = await decode(req.header("token"));
        const usuario = isValid;
        try {
            const usuarioBuscado = await searchUserR(d.usuario);
            const lookbooks = await listarLookbooksR(usuarioBuscado.rol, usuarioBuscado.clima, usuarioBuscado.identidad, usuarioBuscado.genero, usuarioBuscado.grupo, usuarioBuscado.pais);
            if (lookbooks) {
                response.code = 200;
                response.message = "Exito!";
                response.data = lookbooks;
                response.token = usuario.token;
            } else {
                response.code = 404
                response.message = "No se han encontrado lookbooks para este usuario"
                response.token = usuario.token;
            }
        } catch (error) {
            response.code = 400
            response.message = "Ha ocurrido un error al buscar los Lookbooks"
            response.message = error
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

module.exports = { listarLookbooksS };