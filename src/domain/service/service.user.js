const { searchUserR, cambiarContrasenaR, logsLogIn, tabPedidosR, reportUsuariosR, reportZonasR, reportLogsR, clearUserCarritoR, updateUserIdentityR} = require("../repository/repository.user");
const bcrypt = require('bcrypt');
const { validateFields } = require("../../helpers/validaciones");
const Joi = require('joi');
const ejs = require("ejs");
const { saveTokenR, saveTokenContrasenaR, searchTokenR } = require("../repository/repository.token.js");
const { generateAccessTokenS, generateRecuperarContrasena, verifyTokenS, decode, authS } = require("../service/service.auth.js")
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const path = require('path');

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

    let { usuario, password } = req.body;

    // password = await decrypt(password, process.env.ENCRYPT_TOKEN_SECRET)
    // usuario = await decrypt(usuario, process.env.ENCRYPT_TOKEN_SECRET)
    const userT = await searchUserR(usuario);

    if (!userT) {
        response.code = 401
        response.message = "Contaseña y/o usuario incorrecto"
        response.data = []
        return response
    }

    const isValid = await bcrypt.compare(password, userT.password);
    if (!isValid) {
        response.code = 401
        response.message = "Contaseña y/o usuario incorrecto"
        response.data = []
        return response
    } else {
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
            administrador: userT.administrador
        }
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

const userHasChangedIdentityS = async(req, identidad) =>{
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
                    if(erasePedido){
                        response.code=200
                        response.message="Exito!"
                        response.data="¡Se ha vaciado tu carrito!"
                        response.token=isValid.token
                    }else{
                        response.code=200
                        response.message="Exito!"
                        response.data="¡Se ha actualizado su identidad exitosamente!"
                        response.token=isValid.token
                    }
                } else {
                    response.code=400
                    response.message="Error"
                    response.data="Falló la actualizacion de su identidad"
                    response.token=isValid.token
                }
    }else{
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const reportUsuariosS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
        token: ""
    }
    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200 && isValid.data.administrador==true) {
        const usuariosT = await reportUsuariosR();
        if (usuariosT) {
            response.code=200
            response.message="Exito!"
            response.data=usuariosT
            response.token=isValid.token
        } else {
            response.code=401   
            response.message="Ha ocurrido un error!"
        }
    }else{
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const tabPedidosS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
        token: ""
    }
    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200 && isValid.data.administrador==true) {
        const pedidos = await tabPedidosR();
        if (pedidos) {
            response.code=200
            response.message="Exito!"
            response.data=pedidos
            response.token=isValid.token
        } else {
            response.code=401   
            response.message="Ha ocurrido un error!"
        }
    }else{
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const reportZonasS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
        token: ""
    }
    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200 && isValid.data.administrador==true) {
        const pedidos = await reportZonasR();
        if (pedidos) {
            response.code=200
            response.message="Exito!"
            response.data=pedidos
            response.token=isValid.token
        } else {
            response.code=401   
            response.message="Ha ocurrido un error!"
        }
    }else{
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }
    return response
}

const reportLogsS = async(req, res) =>{
    let response = {
        code: "",
        message: "",
        data: {},
        token: ""
    }
    const isValid = await authS(req.header("token"));
    if ((isValid).code == 200 && isValid.data.administrador===true) {
        const pedidos = await reportLogsR();
        if (pedidos) {
            response.code=200
            response.message="Exito!"
            response.data=pedidos
            response.token=isValid.token
        } else {
            response.code=401   
            response.message="Ha ocurrido un error!"
        }
    }else{
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}

const recuperarContrasenaS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
    }
    let usuario = req.body.usuario;
    usuario = await decrypt(usuario, process.env.ENCRYPT_TOKEN_SECRET)
    if (usuario) {
        try {
            const userT = await searchUserR(usuario);
            if (userT) {
                const randomCode = Math.floor(1000 + Math.random() * 9000);
                const tokenContra = await generateRecuperarContrasena(randomCode)
                saveTokenContrasenaR(usuario, tokenContra)
                mailS(userT.correo, "Coleccion RojoTu", `Hola, tu codigo de recuperación es ${randomCode}`, userT.nombre)
                response.code = 200
                response.message = "Se ha enviado un codigo de recuperacion a su correo!"
                response.data = { usuario: userT.user }
            } else {
                response.code = 401
                response.message = "No se ha encontrado este usuario"
            }
        } catch (error) {
            response.code = "401"
            response.message = "Ha ocurrido un error inesperado"
        }
    } else {
        response.code = "401"
        response.message = "Faltan campos por llenar"
    }

    return response
}

const cambiarContrasenaS = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
        token: ""
    }
    let usuario = req.body.usuario;
    usuario = await decrypt(usuario, process.env.ENCRYPT_TOKEN_SECRET)
    if (usuario) {
        try {
            const codigo = req.body.codigo;
            const tokenBd = await searchTokenR(usuario);
            const codigoRecuperacion = await decode(tokenBd.token_recuperacion)
            if (verifyTokenS(tokenBd.token_recuperacion)) {
                if (codigo == codigoRecuperacion.codigo) {
                    const accessToken = await generateAccessTokenS(usuario);
                    await saveTokenR(usuario, accessToken);
                    let { nueva_contrasena } = req.body;
                    nueva_contrasena = await decrypt(nueva_contrasena, process.env.ENCRYPT_TOKEN_SECRET);
                    const userT = await searchUserR(usuario);
                    const cambio = await cambiarContrasenaR(usuario, nueva_contrasena);
                    if (cambio) {
                        mailS(userT.correo, "Coleccion RojoTu", "Hola, su contraseña ha cambiado!")
                        saveTokenContrasenaR(usuario, ".")
                        response.code = 200
                        response.message = "Su contraseña ha cambiado!"
                        response.token = accessToken
                    } else {
                        response.code = 401
                        response.message = "Ha ocurrido un error inesperado"
                    }
                } else {
                    response.code = 401
                    response.message = "Codigo Erroneo"
                }
            } else {
                response.code = 401
                response.message = "Codigo Erroneo intente generando otro codigo"
            }
        } catch (error) {
            response.code = 401
            response.message = "Este codigo ya ha sido utilizado"
        }
    } else {
        response.code = 401
        response.message = "Faltan campos por llenar"
    }
    return response
}

const mailS = async (correoUser, subject, texto) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
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

const mailPedidoS = async (correoUser, subject, texto, usuario) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    let lista_prendas = "";

    var jsonPath = path.join(__dirname, '..', 'assets', 'index.html');
    var header = path.join(__dirname, '..', 'assets', 'header.jpg');
    var footer = path.join(__dirname, '..', 'assets', 'footer.jpg');

    let newHmtl = "";
    ejs.renderFile(jsonPath, {
        usuario: usuario,
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            newHmtl = data;
        }
    });

    newHmtl = newHmtl.replace("<prendas>", lista_prendas)

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: correoUser,
        subject: subject,
        text: texto,
        attachments:
            [
                {
                    filename: 'header.jpg',
                    path: header,
                    cid: 'header'
                },
                {
                    filename: 'footer.jpg',
                    path: footer,
                    cid: 'footer'
                }
            ],
        html: newHmtl
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
module.exports = { authUserS, recuperarContrasenaS, cambiarContrasenaS, mailS, mailPedidoS, reportUsuariosS, tabPedidosS, reportZonasS, reportLogsS, userHasChangedIdentityS }