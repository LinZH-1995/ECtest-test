const swaggerJsdoc = require('swagger-jsdoc') // 產生swagger json檔
const swaggerUi = require('swagger-ui-express') // 將json檔轉成UI介面

//  載入components
const schemas = require('./helpers/swagger-schemas-helper.js')
const responses = require('./helpers/swagger-responses-helper.js')
const requestBodies = require('./helpers/swagger-requestBodies-helper.js')

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
