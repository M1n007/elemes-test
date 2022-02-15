const cloudinary = require('cloudinary').v2;
const globalConfig = require('../configs/globalConfigs')


const init = () => {
    cloudinary.config({ 
        cloud_name: globalConfig.get('/cloudinary').cloudName, 
        api_key: globalConfig.get('/cloudinary').apiKey, 
        api_secret: globalConfig.get('/cloudinary').apiSecret 
    });
}

const upload = (path) => new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, function(error, result) { 
        if (error) {
            return reject(error)
        }

        return resolve(result)

    });
})

module.exports = {
    init,
    upload
}