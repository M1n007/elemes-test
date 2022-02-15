require('dotenv').config();
const confidence = require('confidence');

const config = {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefresh: process.env.JWT_REFRESH,
    passSecret: process.env.PASS_SECRET,
    mongoDbUrl: process.env.MONGO_CONNECTION_URI,
    basicAuthApi: [
        {
            username: process.env.BASIC_AUTH_USERNAME,
            password: process.env.BASIC_AUTH_PASS
        }
    ],
    mysqlConnection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectionLimit: 100,
        debug: false,
        dateStrings: true
    },
    mongoDbTables: {
        yourtables: ''
    },
    minioConfig: {
        endPoint: process.env.MINIO_ENDPOINT,
        useSSL: process.env.MINIO_SSL === 'true' ? true : false,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY
    },
    minioGlobalEndpoint: process.env.MINIO_GLOBAL_ENDPOINT,
    minioBucket: { },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    },
    apiKey: process.env.API_KEY,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
}

const store = new confidence.Store(config);

exports.get = key => store.get(key);