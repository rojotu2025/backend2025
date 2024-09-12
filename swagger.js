const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { options } = require('./swagger-options.js');

const swaggerSpec = swaggerJsdoc(options);
function useSwaggerDocs (app, port = 3000) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
module.exports = { useSwaggerDocs };