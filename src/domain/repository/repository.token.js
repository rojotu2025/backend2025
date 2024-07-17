const db = require("../model/index.js");

const saveTokenR = async (usuario, refreshToken) => {
    const token = await db.token.findOne({
        where: {
            usuario: usuario
        }
    });

    if (token) {
        return await db.token.update(
            {
                usuario: usuario,
                refresh_token: refreshToken
            },
            {
                where: {
                    usuario: usuario
                }
            })
    } else {
        return await db.token.create(
            {
                usuario: usuario,
                refresh_token: refreshToken,
            })
    }
}

const saveTokenContrasenaR = async (usuario, tokenPassword) => {
    const token = await db.token.findOne({
        where: {
            usuario: usuario
        }
    });

    if (token) {
        return await db.token.update(
            {
                token_recuperacion: tokenPassword
            },
            {
                where: {
                    usuario: usuario
                }
            })
    } else {
        return await db.token.create(
            {
                usuario: usuario,
                token_recuperacion: tokenPassword,
            })
    }
}

const searchTokenR = async (usuario) => {
    return await db.token.findOne({
        where: {
            usuario: usuario
        }
    });
}

module.exports = { saveTokenR, searchTokenR, saveTokenContrasenaR }