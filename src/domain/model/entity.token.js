const { Sequelize } = require('sequelize')

function model(sequelize) {
    const attributes = {
        usuario: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        refresh_token: { type: Sequelize.STRING, allowNull: true },
        token_recuperacion: { type: Sequelize.STRING, allowNull: true },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('tokens', attributes, options)
    return _model
}
module.exports = model