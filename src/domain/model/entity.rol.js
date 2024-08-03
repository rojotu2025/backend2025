const { Sequelize } = require('sequelize')

function model(sequelize) {
    const attributes = {
        pais: { type: Sequelize.STRING, allowNull: false },
        genero: { type: Sequelize.STRING, allowNull: false },
        rol: { type: Sequelize.STRING, allowNull: false },
        clima: { type: Sequelize.STRING, allowNull: false },
        grupo: { type: Sequelize.STRING, allowNull: false },
        prendas_superiores: { type: Sequelize.STRING, allowNull: false },
        prendas_inferiores: { type: Sequelize.STRING, allowNull: false },
        prendas_otros: { type: Sequelize.STRING, allowNull: false },
        total: { type: Sequelize.STRING, allowNull: false },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('roles', attributes, options)
    return _model
}

module.exports = model