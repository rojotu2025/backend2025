const { Sequelize } = require('sequelize')

function model(sequelize) {
    const attributes = {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_carrito: {
            type: Sequelize.INTEGER,
            model: 'carritos',
            key: 'id',
        },
        id_prenda: {
            type: Sequelize.STRING,
            model: 'prendas',
            key: 'id',
        },

        id_prenda_carrito: {
            type: Sequelize.STRING,
        },
        
        talla: {
            type: Sequelize.STRING,
        },
    }

    const options = {
        timestamps: false
    }

    const _model = sequelize.define('carrito_prendas', attributes, options)
    return _model
}

module.exports = model