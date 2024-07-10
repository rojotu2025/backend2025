const { DataTypes } = require('sequelize')

function model(sequelize) {
    const attributes = {
        referencia: { type: DataTypes.STRING, allowNull: false },
        nombre_prenda: { type: DataTypes.STRING, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        proveedor: { type: DataTypes.STRING, allowNull: false },
        nombre_archivo: { type: DataTypes.STRING, allowNull: false },
        tipo: { type: DataTypes.STRING, allowNull: false },
        dia: { type: DataTypes.STRING, allowNull: false },
        clima: { type: DataTypes.STRING, allowNull: false },
        genero: { type: DataTypes.STRING, allowNull: false },
        rol: { type: DataTypes.STRING, allowNull: false },
        pais: { type: DataTypes.STRING, allowNull: false },
        grupo: { type: DataTypes.STRING, allowNull: false },
        referencia_prenda_superior: { type: DataTypes.STRING, allowNull: true },
        referencia_prenda_inferior: { type: DataTypes.STRING, allowNull: true },
        referencia_chaqueta: { type: DataTypes.STRING, allowNull: true },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('front_outfits', attributes, options)
    return _model
}
module.exports = model