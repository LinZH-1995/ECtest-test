const express = require('express')
const expSession = require('express-session')
const methodOverride = require('method-override')
const helmet = require('helmet')
const compression = require('compression')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes') // import routes from routes folder
const passport = require('./config/passport.js') // import passport from config folder

const app = express()
const port = process.env.PORT || 3000

// swagger
const initSwagger = require('./swagger/swagger.js')
initSwagger(app)

app.use(helmet()) // helmet套件防止網路攻擊，見 https://expressjs.com/zh-tw/advanced/best-practice-security.html
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(expSession({
  secret: process.env.SESSION_SECRET || 'secret',
  saveUninitialized: false,
  resave: true,
  cookie: { maxAge: 1200000 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/uploads', express.static('./uploads')) // 網頁顯示圖片用 <img src="/uploads/xxx.jpg">

app.use('/api', routes)

app.listen(port, () => console.log(`Server is listening on port:${port}`))

module.exports = app
