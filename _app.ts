// Packages
import express from 'express'
import expSession from 'express-session'
import methodOverride from 'method-override'
import helmet from 'helmet'
import compression from 'compression'
import { config } from 'dotenv'

// Folders
import routes from './routes/_index' // import routes from routes folder
import passport from './config/_passport' // import passport from config folder

if (process.env.NODE_ENV !== 'production') {
  config()
}

// Variables
const app = express()
const port = process.env.PORT ?? 3000

// Set app
app.use(helmet()) // helmet套件防止網路攻擊，見 https://expressjs.com/zh-tw/advanced/best-practice-security.html
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(expSession({
  secret: process.env.SESSION_SECRET ?? 'secret',
  saveUninitialized: false,
  resave: true,
  cookie: { maxAge: 1200000 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/uploads', express.static('./uploads')) // 網頁顯示圖片用 <img src="/uploads/xxx.jpg">

app.use('/api', routes)

app.listen(port, () => { console.log(`Server is listening on port:${port}`) })
