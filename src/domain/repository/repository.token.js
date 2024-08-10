const db = require("../model/index.js");

const saveTokenR = async (usuario, refreshToken) => {
    try {
        return await db.tokens.bulkCreate
        (
            [
                {
                    usuario: usuario,
                    refresh_token: refreshToken
                },
            ],
            { updateOnDuplicate: ['refresh_token'] },
        )
    } catch (error) {
        console.log(error);
        return false;
    }
}

const saveTokenContrasenaR = async (usuario, tokenPassword) => {
    try {
        return await db.tokens.bulkCreate
        (
            [
                {
                    usuario: usuario,
                    token_recuperacion: tokenPassword,
                },
            ],
            { updateOnDuplicate: ['token_recuperacion'] },
        )
    } catch (error) {
        console.log(error);
        return false;
    }
}

const searchTokenR = async (usuario) => {
    return await db.tokens.findOne({
        where: {
            usuario: usuario
        }
    });
}

module.exports = { saveTokenR, searchTokenR, saveTokenContrasenaR }