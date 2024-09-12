const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Rojotu API',
        description: "Rojotu API services documented on swagger",
        contact: {
          name: "Rojotu Dev Team",
          email: "rojotu2024@gmail.com",
          url: "https://github.com/DesmondSanctity/node-js-swagger"
        },
        version: '1.0.1',
      },
      servers: [
        {
          url: "http://localhost:3000/",
          description: "RojoTu Backend Local server"
        },
        {
          url: "https://whale-app-4ogbb.ondigitalocean.app/api/",
          description: "RojoTu Backend Live server"
        },
      ]
    },

    apis: ['./api/routes/index.js'],
}

module.exports = { options };