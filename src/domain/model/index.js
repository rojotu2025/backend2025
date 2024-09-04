const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)

const db = {}
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DBPORT,
    dialect: process.env.DATABASE_DIALECT,
    timezone: "America/Bogota",
    pool: {
        max: 5,
        min: 0
    }
})

function closeSequelize() {
    sequelize.close()
        .then(() => {
            console.log('Sequelize connection closed.');
        })
        .catch((error) => {
            console.error('Error closing Sequelize connection:', error);
        });
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
        )
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.closeConnection = closeSequelize;
db.sequelize = sequelize;
process.on('exit', db.closeConnection);
process.on('SIGINT', db.closeConnection);
process.on('SIGTERM', db.closeConnection);
module.exports = db;
