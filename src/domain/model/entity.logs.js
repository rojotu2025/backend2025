const { date } = require('joi');
const { Sequelize } = require('sequelize');

function model(sequelize) {
    const date = new Date();
    const attributes = {
        usuario: { type: Sequelize.STRING, allowNull: false },
    }
    const options = {
        timestamps: true
    }
    const _model = sequelize.define('logs', attributes, options)
    return _model
}
module.exports = model