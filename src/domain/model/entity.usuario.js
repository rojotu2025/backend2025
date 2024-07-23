const { Sequelize } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nro_documento: { type: Sequelize.STRING, allowNull: false },
        nombre_colaborador: { type: Sequelize.STRING, allowNull: false },
        correo: { type: Sequelize.STRING, allowNull: true },
        unidad_negocio: { type: Sequelize.STRING, allowNull: false },
        pais: { type: Sequelize.STRING, allowNull: false },
        posicion: { type: Sequelize.STRING, allowNull: false },
        departamento: { type: Sequelize.STRING, allowNull: false },
        ciudad: { type: Sequelize.STRING, allowNull: true },
        tipo_contrato: { type: Sequelize.STRING, allowNull: false },
        sucursal: { type: Sequelize.STRING, allowNull: false },
        genero: { type: Sequelize.STRING, allowNull: false },
        identidad: { type: Sequelize.STRING, allowNull: false },
        clima: { type: Sequelize.STRING, allowNull: true },
        rol: { type: Sequelize.STRING, allowNull: false },
        grupo: { type: Sequelize.STRING, allowNull: false },
        usuario: { type: Sequelize.STRING, allowNull: true },
        contrasena: { type: Sequelize.STRING, allowNull: false },
        primer_ingreso: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        administrador: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('usuarios', attributes, options)
    /*
    _model.associate = function (models) {
        models.usuario.hasOne(models.pedido)
    }*/

    return _model
}
module.exports = model