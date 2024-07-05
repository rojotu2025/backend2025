const { DataTypes } = require('sequelize')

function model(sequelize) {
    const attributes = {
        referencia: { type: DataTypes.STRING, allowNull: false },
        nombre_prenda: { type: DataTypes.STRING, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        proveedor: { type: DataTypes.STRING, allowNull: false },
        ubicacion_archivo: { type: DataTypes.STRING, allowNull: false },
        nombre_archivo: { type: DataTypes.STRING, allowNull: false },
        tipo: { type: DataTypes.STRING, allowNull: false },
        clima: { type: DataTypes.STRING, allowNull: false },
        segmento_Prenda: { type: DataTypes.STRING, allowNull: false },
        genero: { type: DataTypes.STRING, allowNull: false },
        tallas: { type: DataTypes.STRING, allowNull: false },
        rol: { type: DataTypes.STRING, allowNull: false },
        pais: { type: DataTypes.STRING, allowNull: false },
        grupo: { type: DataTypes.STRING, allowNull: false },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('prendas', attributes, options)
    return _model
}
module.exports = model