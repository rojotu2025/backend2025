const { date } = require('joi');
const { DataTypes } = require('sequelize');

function model(sequelize) {
    const date = new Date();
    const attributes = {
        usuario: { type: DataTypes.STRING, allowNull: false },
    }
    const options = {
        timestamps: true
    }
    const _model = sequelize.define('logs', attributes, options)
    return _model
}
module.exports = model