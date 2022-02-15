const Minio = require('minio');
const globalConfig = require('../configs/globalConfigs')
let minioClient;

const init = () => {
    minioClient = new Minio.Client(globalConfig.get('/minioConfig'));
};

const presignedGetObject = async (bucket, url) => {
	const result = await minioClient.presignedGetObject(bucket, url, 24 * 60 * 60);

	if (result) {
		return result;
	}
};

const objectUpload = async (bucketName, objectName, filePath) => {
	try {
		const isUploaded = await minioClient.fPutObject(bucketName, objectName, filePath);
		if (isUploaded) {
			return isUploaded;
		}
	} catch (err) {
		return err;
	}
};

const streamUpload = async (bucketName, objectName, newBuffer) => {
	try {
		const isUploaded = await minioClient.putObject(bucketName, objectName, newBuffer);
		if (isUploaded) {
			return isUploaded;
		}
	} catch (err) {
		return err;
	}
};

const removeObject = async (bucketName, objectName) => {
	try {
		await minioClient.removeObject(bucketName, objectName);
		const data = {
			status: true,
			message: 'Object Removed'
		};
		return data;
	} catch (err) {
		const data = {
			status: false,
			message: 'Object Can`t Removed',
			err
		};
		return data;
	}

};


module.exports = {
	init,
	presignedGetObject,
	objectUpload,
    streamUpload,
    removeObject
}

