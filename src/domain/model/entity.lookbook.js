const { Sequelize } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id_prenda_superior: {
            type: Sequelize.STRING,
            model: 'prendas',
            key: 'id',
        },
        id_prenda_inferior: {
            type: Sequelize.STRING,
            model: 'prendas',
            key: 'id',
        },
        id_prenda_otro: {
            type: Sequelize.STRING,
            model: 'prendas',
            key: 'id',
        },
        rol: { type: Sequelize.STRING, },
        clima:{ type: Sequelize.STRING, },
        identidad:{ type: Sequelize.STRING},
        genero:{ type: Sequelize.STRING, },
        grupo:{ type: Sequelize.STRING, },
        pais:{ type: Sequelize.STRING, },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('lookbooks', attributes, options)
    return _model
}
module.exports = model