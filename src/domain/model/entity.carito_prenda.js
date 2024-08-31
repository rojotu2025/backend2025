const { Sequelize } = require('sequelize')

function model(sequelize) {
    const attributes = {
        id_carrito: {
            type: Sequelize.INTEGER,
            model: 'carritos',
            key: 'id',
            primaryKey: true
        },

        id_prenda: {
            type: Sequelize.STRING,
            model: 'prendas',
            key: 'id',
            primaryKey: true
        },

        talla: {
            type: Sequelize.STRING,
        },

        dia: {
            type: Sequelize.STRING,
            allowNull: true
        },
    }

    const options = {
        timestamps: false
    }

    const _model = sequelize.define('carrito_prendas', attributes, options)
    return _model
}

module.exports = model