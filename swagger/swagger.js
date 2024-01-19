const swaggerJsdoc = require('swagger-jsdoc') // 產生swagger json檔
const swaggerUi = require('swagger-ui-express') // 將json檔轉成UI介面

//  載入components
const schemas = require('./components/swagger-schemas.js')
const responses = require('./components/swagger-responses.js')
const requestBodies = require('./components/swagger-requestBodies.js')
const parameters = require('./components/swagger-parameters.js')

const initSwagger = function (app) {
  // swagger-jsdoc設定
  const jsDocOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ECtest-test',
        version: '1.0.0'
      },
      components: {
        securitySchemes: {
          bearerAuth: { // JWT驗證
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas,
        parameters,
        responses,
        requestBodies
      }
    },
    apis: ['./routes/*.js', './routes/modules/*.js'] // 讀取註解的路徑
  }

  const swaggerSpec = swaggerJsdoc(jsDocOptions)

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = initSwagger
