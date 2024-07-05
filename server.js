//Dependencias del proyecto
require("dotenv").config();
const express = require('express')
const cors = require("cors")
const app = express();
const swagger = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const routers = require('./src/api/routes/index');
const db = require('./src/domain/model/index');

db.sequelize.sync()
    .then(() => console.log("\nBase de datos: \nEstatus: OK\nMensaje: Todo bien."))
    .catch(error => console.log("Base de datos: \nEstatus: Error\nMensaje:", error))

const corsOptions = {
    origin: process.env.CORS
};

app.use(cors(corsOptions));

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));

app.use("/api", routers);

//Log de inicio de servidor
app.listen(process.env.PORT, async () => {
    console.log(`\n\nAPI AWS\n\nPORT: ${process.env.PORT}\nURL ACCESS: http://localhost:${process.env.PORT}\n\n`)
})
    
module.exports = app;