const { DataTypes } = require('sequelize')

function model(sequelize) {
    const attributes = {
        usuario: { type: DataTypes.STRING, allowNull: false },
        refresh_token: { type: DataTypes.STRING, allowNull: true },
        token_recuperacion: { type: DataTypes.STRING, allowNull: true },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('token', attributes, options)
    return _model
}
module.exports = model