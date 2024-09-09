require("dotenv").config();
const express = require('express')
const cors = require("cors")
const app = express();
const routers = require('./src/api/routes/index');
const db = require('./src/domain/model/index');
const helmet = require("helmet");
const { useSwaggerDocs } = require('./swagger.js');
const allowedMethods = ['GET', 'POST']
const sqlInjectionPattern = /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|;|'|"|\/\*|\*\/|xp_)\b)/i;
const allowlist = [process.env.CORS_ROJOTU, process.env.CORS_UAT, process.env.CORS_LOCAL]

db.sequelize.sync()
    .then(() => console.log("\nBase de datos: \nEstatus: OK\nMensaje: Todo bien."))
    .catch(error => console.log("Base de datos: \nEstatus: Error\nMensaje:", error))

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

function securityHeadersMiddleware(req, res, next) {
    res.removeHeader('Referrer-Policy');
    res.removeHeader('Permissions-Policy');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('X-Content-Type-Options');
    res.removeHeader('Strict-Transport-Security');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(false), camera=(false), microphone=(false)');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
}

// Aplicar el middleware
app.use(securityHeadersMiddleware);

app.use(
    helmet(),
);

app.use(cors(corsOptionsDelegate));
if (process.env.SWAGGER_ON === "true") {
    useSwaggerDocs(app);
}

app.disable('x-powered-by');
app.use("/api", (req, res, next) => {
    if (!allowedMethods.includes(req.method)) return res.status(405).json('Metodo No Permitido')
    return next()
});

function removeQueryParamsMiddleware(req, res, next) {
    const parsedUrl = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    if (parsedUrl.search) {
        parsedUrl.search = '';  // Elimina los parámetros
        return res.redirect(parsedUrl.toString()); // Redirige a la URL sin los parámetros
    }
    next();
}

function sanitizeInput(input) {
    return input.replace(sqlInjectionPattern, '');
}

function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);  // Recursividad para objetos anidados
        }
    }
}

function preventSQLInjection(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    }
    function hasSQLInjection(value) {
        return sqlInjectionPattern.test(value);
    }
    for (const param in req.query) {
        if (hasSQLInjection(req.query[param])) {
            return res.status(400).send('Solicitud bloqueada');
        }
    }
    for (const param in req.body) {
        if (hasSQLInjection(req.body[param])) {
            return res.status(400).send('Solicitud bloqueada');
        }
    }

    for (const header in req.headers) {
        if (hasSQLInjection(req.headers[header])) {
            return res.status(400).send('Solicitud bloqueada');
        }
    }
    next();
}

app.use(express.json());
app.use(removeQueryParamsMiddleware);
app.use(preventSQLInjection);
app.use("/api", routers);

app.listen(process.env.PORT, async () => {
    console.log(`\n\n API RojoTu Corriendo en \n\n PORT: ${process.env.PORT}\n ACCESS URL: ${process.env.HOST}:${process.env.PORT}\n\n`)
})

module.exports = app;