const helper = require('../../helpers/helper')
const query = require('./queries')
const mime = require('mime-types')
const minioHelper = require('../../helpers/minio')
const cloudinary = require('../../helpers/cloudinary');
const { v4: uuidv4 } = require('uuid')
const globalConfig = require('../../configs/globalConfigs')
const FileType = require('file-type');
const momentTimezone = require('moment-timezone');
const dateNow = momentTimezone().tz('Asia/Jakarta').toISOString();

const uploadMedia = async payload => {
    const allowedExtension = ['png', 'jpeg', 'mp4', 'webp', 'svg', 'jpg'];

    if (!payload.files) {
        return helper.response(400, 400, 'required body files if type uploader is path', false)
    }

    if (payload.files && payload.base64) { 
        return helper.response(400, 400, 'Bad Request!', false)
    }

    const { path, type, size, name } = payload.files;

    const extension = mime.extension(type);
    
    if (!allowedExtension.includes(extension)) {
        return helper.response(403, 403, `Type ${type} not allowed`, false)
    }

    if (size > 1096000) {
        return helper.response(403, 403, 'File is too large, maximal 1mb', false)
    }

    let uuid = uuidv4();
    const uploadFiles = await cloudinary.upload(path);
    if (!uploadFiles) {
        return helper.response(500, 'Gagal Upload Files', false)
    }

    let param = {
        mediaId: uuid,
        mediaType: extension,
        mediaUrl: uploadFiles.url,
        createdAt: dateNow,
        updatedAt: dateNow
    }

    const addMedia = await query.insertOneMedia(param);
    if (addMedia.err) {
        return helper.response(500, 'Internal server error', false)
    }

    return helper.responseCode(0, 'Success upload media!', param)

    
}


module.exports = {
    uploadMedia
}