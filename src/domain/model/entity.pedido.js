const { DataTypes, Sequelize } = require('sequelize')
function model(sequelize) {
    const attributes = {
        usuario: { type: DataTypes.STRING, allowNull: false },
        pedido: { type: Sequelize.JSON, allowNull: true },
        estado_pedido: {
            type: DataTypes.ENUM,
            values: ['creado', 'pendiente', 'enviado']
        },
        fecha_solicitud: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        fecha_actualizacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    }
    const options = {
        timestamps: false
    }

    const _model = sequelize.define('pedido', attributes, options)
    _model.associate = function (models) {
        models.pedido.belongsTo(models.usuario, {
            as: 'usuarios',
            foreignKey: {
                name: 'usuario',
                as: 'id',
            }
        })
    }
    return _model
}
module.exports = model