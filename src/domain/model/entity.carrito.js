const { Sequelize } = require('sequelize')

function model(sequelize) {
    const attributes = {
        usuario: { 
            type: Sequelize.STRING, 
            model: 'usuarios',
            key: 'usuario',
        },

        estado_carrito: {
            type: Sequelize.ENUM,
            values: ['creado','pendiente','enviado'],
        },

        fecha_solicitud: {
            type: Sequelize.DATEONLY,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },

        fecha_actualizacion: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        }
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('carritos', attributes, options)
    return _model
}
module.exports = model
