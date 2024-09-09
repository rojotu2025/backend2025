const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { options } = require('./swagger-options.js');

const swaggerSpec = swaggerJsdoc(options);
const useSwaggerDocs = (app, port = 3000) => {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
module.exports = { useSwaggerDocs };