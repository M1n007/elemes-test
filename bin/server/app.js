const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwtVerifer = require('../auth/jwt_helper')
const logger = require('morgan')
const apiKey = require('../auth/auth_key_helper');
const Mongodb = require('../helpers/databases/mongodb/connection');
const multipart = require('connect-multiparty');
const cloudinary = require('../helpers/cloudinary');


Mongodb.init();
cloudinary.init();



const app = express();

app.use((req, res, next) => {
   res.append("Set-Cookie", "HttpOnly;Secure;SameSite=Strict")
   next()
})

app.use(cors())
app.use(logger('short'))
app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({limit: '200mb', extended: false }))
app.use(cookieParser())
app.use(multipart())
app.use(apiKey.init())


const authRouter = require('../routes/auth/auth');
const courseRouter = require('../routes/course/course');
const categoryRouter = require('../routes/category/category');
const mediaRoute = require('../routes/media/media');

app.get('/', function (req, res, next) {
   res.send('Services working perfectly.')
})

app.use('/api/v1/users/', authRouter);
app.use('/api/v1/course/', courseRouter);
app.use('/api/v1/category/', categoryRouter);
app.use('/api/v1/media/', mediaRoute);

module.exports = app