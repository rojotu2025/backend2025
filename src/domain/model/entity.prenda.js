const { Sequelize, DataTypes} = require('sequelize')

function model(sequelize) {
    const attributes = {
        referencia: { type: Sequelize.STRING, allowNull: false },
        nombre_prenda: { type: Sequelize.STRING, allowNull: false },
        descripcion: { type: Sequelize.STRING, allowNull: true },
        composicion: { type: Sequelize.STRING, allowNull: true },
        proveedor: { type: Sequelize.STRING, allowNull: true },
        tipo: {
            type: Sequelize.ENUM,
            values: [ 'PRENDA', 'OUTFIT', 'LOOKBOOK', 'PRENDA_LOOKBOOK' ],
        },
        clima: { type: Sequelize.STRING, allowNull: false },
        genero: { type: Sequelize.STRING, allowNull: false },
        identidad: { type: Sequelize.STRING, allowNull: false },
        tallas: { type: Sequelize.STRING, allowNull: true },
        dias: { type: Sequelize.STRING, allowNull: true },
        rol: { type: Sequelize.STRING, allowNull: false },
        pais: { type: Sequelize.STRING, allowNull: false },
        grupo: { type: Sequelize.STRING, allowNull: false },
        referencia_prenda_superior: { type: Sequelize.STRING, allowNull: true },
        referencia_prenda_inferior: { type: Sequelize.STRING, allowNull: true },
        referencia_chaqueta: { type: Sequelize.STRING, allowNull: true },
        segmento_Prenda: { type: Sequelize.STRING, allowNull: true},
        ubicacion_archivo: { type: Sequelize.STRING, allowNull: true },
        nombre_archivo: { type: Sequelize.STRING, allowNull: true },
    }
    const options = {
        timestamps: false
    }
    const _model = sequelize.define('prendas', attributes, options)
    return _model
}
module.exports = model
