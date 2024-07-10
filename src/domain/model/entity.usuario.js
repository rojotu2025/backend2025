const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        nro_documento: { type: DataTypes.STRING, allowNull: false },
        nombre_colaborador: { type: DataTypes.STRING, allowNull: false },
        correo: { type: DataTypes.STRING, allowNull: true },
        unidad_negocio: { type: DataTypes.STRING, allowNull: false },
        pais: { type: DataTypes.STRING, allowNull: false },
        posicion: { type: DataTypes.STRING, allowNull: false },
        departamento: { type: DataTypes.STRING, allowNull: false },
        ciudad: { type: DataTypes.STRING, allowNull: true },
        tipo_contrato: { type: DataTypes.STRING, allowNull: false },
        sucursal: { type: DataTypes.STRING, allowNull: false },
        genero: { type: DataTypes.STRING, allowNull: false },
        identidad: { type: DataTypes.STRING, allowNull: false },
        clima: { type: DataTypes.STRING, allowNull: true },
        rol: { type: DataTypes.STRING, allowNull: false },
        grupo: { type: DataTypes.STRING, allowNull: false },
        usuario: { type: DataTypes.STRING, allowNull: true },
        contrasena: { type: DataTypes.STRING, allowNull: false },
        primer_ingreso: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        administrador: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('usuario', attributes, options)
    _model.associate = function (models) {
        models.usuario.hasOne(models.pedido)
    }

    return _model
}
module.exports = model