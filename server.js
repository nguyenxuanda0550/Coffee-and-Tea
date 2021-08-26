const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const methodOverride = require('method-override')
const categoryRouter = require('./routes/categories')
const productRouter = require('./routes/product')
const indexRouter = require('./routes/index')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')
const flash = require('express-flash')
const passport = require('passport')
const mongoose = require('mongoose')
const app = express()

require('./models/passport.model')(passport)
require('dotenv').config()

app.use(flash())
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.urlencoded({ extended: false, limit: '10mb' }))
app.set('layout', 'layouts/layout')
app.use(express.static('public'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})


app.use(passport.initialize())
app.use(passport.session())

//connectDataBase
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.STR_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log("Connect successfully")
    } catch (e) {
        console.log(e)
        console.log("Connect failed")
    }
}
connectDB()



app.use(methodOverride('_method'))
app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)

app.listen(process.env.PORT || 3000)