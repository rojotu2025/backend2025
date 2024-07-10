const { DataTypes, Sequelize } = require('sequelize')

function model(sequelize) {
    const attributes = {
        pais: { type: DataTypes.STRING, allowNull: false },
        genero: { type: DataTypes.STRING, allowNull: false },
        rol: { type: DataTypes.STRING, allowNull: false },
        clima: { type: DataTypes.STRING, allowNull: false },
        grupo: { type: DataTypes.STRING, allowNull: false },
        prendas_superiores: { type: DataTypes.STRING, allowNull: false },
        prendas_inferiores: { type: DataTypes.STRING, allowNull: false },
        prendas_otros: { type: DataTypes.STRING, allowNull: false },
        total: { type: DataTypes.STRING, allowNull: false },
        url_3d: { type: DataTypes.STRING, allowNull: false },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('rol', attributes, options)
    return _model
}

module.exports = model