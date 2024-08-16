const db = require("../model/index.js");

const saveTokenR = async (usuario, refreshToken) => {
    try {
        const userT = await db.tokens.findOne({
            where: {
                usuario: usuario,
            },
            raw: true
        });

        if (userT) {
            return await db.tokens.update(
                {
                    refresh_token: refreshToken
                },
                {
                    where: {
                        usuario: usuario
                    }
                })

        } else {
            return carrito = await db.tokens.create(
                {
                    usuario: usuario,
                    refresh_token: refreshToken
                });
        }
    } catch (error) {
        console.log(error);
        return false
    }
}

const saveTokenContrasenaR = async (usuario, tokenPassword) => {
    try {
        const userT = await db.tokens.findOne({
            where: {
                usuario: usuario
            },
            raw: true
        });

        console.log(userT);
        if (userT) {
            return await db.tokens.update(
                {
                    token_recuperacion: tokenPassword,
                },
                {
                    where: {
                        usuario: usuario
                    }
                })

        } else {
            return carrito = await db.tokens.create(
                {
                    usuario: usuario,
                    token_recuperacion: tokenPassword,
                });
        }
    } catch (error) {
        console.log(error);
        return false
    }
}

const searchTokenR = async (usuario) => {
    return await db.tokens.findOne({
        where: {
            usuario: usuario
        },
        raw: true
    });
}

module.exports = { saveTokenR, searchTokenR, saveTokenContrasenaR }