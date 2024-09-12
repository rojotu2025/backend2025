const { searchUserR, cambiarContrasenaR, logsLogIn, tabPedidosR, reportUsuariosR, reportZonasR, reportLogsR, clearUserCarritoR, updateUserIdentityR } = require("../repository/repository.user");
const bcrypt = require('bcrypt');
const { validateFields } = require("../../helpers/validaciones");
const Joi = require('joi');
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const { saveTokenR, saveTokenContrasenaR, searchTokenR } = require("../repository/repository.token.js");
const { generateAccessTokenS, generateRecuperarContrasena, verifyTokenS, decode, authS } = require("../service/service.auth.js")

const authUserS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
    }

    const schemaBody = Joi.object({
        usuario: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(1).max(255).required()
    });

    let isValidFields = validateFields(schemaBody, req.body, response);
    if (isValidFields) {
        return response;
    }
    try {
        let { usuario, password } = req.body;
        usuario = await decrypt(usuario, process.env.ENCRYPT_TOKEN_SECRET)
        const userT = await searchUserR(usuario);
        password = await decrypt(password, process.env.ENCRYPT_TOKEN_SECRET)
        const isValid = await bcrypt.compare(password, userT.password);
        if (!isValid) {
            response.code = 401
            response.message = "Contaseña y/o usuario incorrecto"
            response.data = []
            return response
        }
        const accessToken = await generateAccessTokenS(userT.user);
        await logsLogIn(userT.user);
        response.code = 200
        response.message = "Autorizado"
        response.data = {
            user: encrypt(userT.user, process.env.ENCRYPT_TOKEN_SECRET),
            nombre: encrypt(userT.nombre, process.env.ENCRYPT_TOKEN_SECRET),
            token: accessToken,
            rol: userT.rol,
            genero: userT.genero,
            clima: userT.clima,
            grupo: userT.grupo,
            ciudad: userT.ciudad,
            pais: userT.pais,
            sucursal: userT.sucursal,
            cargo: userT.cargo,
            vp: userT.VP,
            identidad: userT.identidad,
            prendas_superiores: userT.prendas_superiores,
            prendas_inferiores: userT.prendas_inferiores,
            prendas_otros: userT.prendas_otros,
            total: userT.total,
            correo: encrypt(userT.correo, process.env.ENCRYPT_TOKEN_SECRET),
            primer_ingreso: userT.primer_ingreso,
            administrador: userT.administrador,
            dashboard: userT.dashboard
        }
        return response
    } catch (error) {
        response.code = 401
        response.message = "Contaseña y/o usuario incorrecto"
        response.data = []
        return response
    }
}

const encrypt = (data, key) => {
    return ciphertext = CryptoJS.AES.encrypt(data, key).toString();
}

const decrypt = async (data, key) => {
    var bytes = CryptoJS.AES.decrypt(data, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

const userHasChangedIdentityS = async (req, identidad) => {
    let response = {
        code: "",
        message: "",
        data: {},
        token: ""
    }
    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200) {
        const d = await decode(req.header("token"));
        const userIdentity = await updateUserIdentityR(d.usuario, identidad);
        if (userIdentity) {
            const erasePedido = await clearUserCarritoR(d.usuario);
            if (erasePedido) {
                response.code = 200
                response.message = "Exito!"
                response.data = "¡Se ha vaciado tu carrito!"
                response.token = isValid.token
            } else {
                response.code = 200
                response.message = "Exito!"
                response.data = "¡Se ha actualizado su identidad exitosamente!"
                response.token = isValid.token
            }
        } else {
            response.code = 400
            response.message = "Error"
            response.data = "Falló la actualizacion de su identidad"
            response.token = isValid.token
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const recuperarContrasenaS = async (usuario) => {
    let response = {
        code: "",
        message: "",
        data: {},
    }
    usuario = await decrypt(usuario, process.env.ENCRYPT_TOKEN_SECRET)
    try {
        const userT = await searchUserR(usuario);
        if (userT) {
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const tokenContra = await generateRecuperarContrasena(randomCode);
            await saveTokenContrasenaR(usuario, tokenContra)
            mailS(userT.correo, "Coleccion RojoTu", `Hola, tu codigo de recuperación es ${randomCode}`, userT.nombre)
            response.code = 200;
            response.message = "Se ha enviado un codigo de recuperacion a su correo!"
            response.data = []
        } else {
            response.code = 404
            response.message = "No se ha encontrado este usuario"
            response.data = []
        }
    } catch (error) {
        console.log(error)
        response.code = 401
        response.message = "Ha ocurrido un error inesperado"
        response.data = []
    }
    return response
}

const cambiarContrasenaS = async (usuario, codigo, nueva_contrasena) => {
    let response = {
        code: 404,
        message: "",
        data: [],
        token: ""
    }

    try {

        usuario = await decrypt(usuario, process.env.ENCRYPT_TOKEN_SECRET)
        const tokenBd = await searchTokenR(usuario);
        const codigoRecuperacion = await decode(tokenBd.token_recuperacion)
        console.log(codigoRecuperacion);
        if (codigo == codigoRecuperacion.codigo) {
            const nueva_contrasenaD = await decrypt(nueva_contrasena, process.env.ENCRYPT_TOKEN_SECRET);
            console.log(nueva_contrasenaD);
            await cambiarContrasenaR(usuario, nueva_contrasenaD);
            const userT = await searchUserR(usuario);
            mailS(userT.correo, "Coleccion RojoTu - Cambio de contraseña Exitoso", "Su contraseña se ha cambiado exitosamente!")
            const accessToken = await generateAccessTokenS(usuario);
            await saveTokenR(usuario, accessToken);
            await saveTokenContrasenaR(usuario, "")
            response.code = 200
            response.message = "Su contraseña se ha cambiado exitosamente!"
            response.token = accessToken
        } else {
            response.code = 401
            response.message = "Codigo Erroneo!"
        }
    } catch (error) {
        console.log(error);
        response.code = 401
        response.message = "Este usuario no tiene un codigo de recuperación"
    }

    return response
}

const mailS = async (correoUser, subject, texto) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secureConnection: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    const mailOptions = {
        from: 'Admin@coleccionrojotu.com',
        to: correoUser,
        subject: subject,
        text: texto,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return false;
        } else {
            console.log('Correo enviado correctamente:', info.response);
            return true;
        }
    });
}

module.exports = { authUserS, recuperarContrasenaS, cambiarContrasenaS, mailS, userHasChangedIdentityS }
