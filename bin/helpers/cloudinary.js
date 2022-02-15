const cloudinary = require('cloudinary').v2;


const init = () => {
    cloudinary.config({ 
        cloud_name: 'dauxljawn', 
        api_key: '148952629126864', 
        api_secret: 'JrSU7nC4XsmmNQOIZ6ZeZ_506OE' 
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