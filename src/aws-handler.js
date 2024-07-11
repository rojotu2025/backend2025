const app = require("./server")
const serverlessExpress = require('@vendia/serverless-express')

exports.handler = serverlessExpress({ app })