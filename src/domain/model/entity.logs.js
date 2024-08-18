const { date } = require('joi');
const { Sequelize } = require('sequelize');

function model(sequelize) {
    const date = new Date();
    const attributes = {
        usuario: { type: Sequelize.STRING, allowNull: false },
        ciudad: { type: Sequelize.STRING, allowNull: true },
        sucursal: { type: Sequelize.STRING, allowNull: true },
        pais: { type: Sequelize.STRING, allowNull: true },
        genero: { type: Sequelize.STRING, allowNull: true },
        identidad: { type: Sequelize.STRING, allowNull: true },
        clima: { type: Sequelize.STRING, allowNull: true },
        rol: { type: Sequelize.STRING, allowNull: true },
        grupo: { type: Sequelize.STRING, allowNull: true },
        carrito_enviado: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    }
    const options = {
        timestamps: true
    }
    const _model = sequelize.define('logs', attributes, options)
    return _model
}
module.exports = model