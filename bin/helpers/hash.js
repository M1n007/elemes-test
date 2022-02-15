const Cryptr = require('cryptr');
const globalConfig = require('../configs/globalConfigs');

const passwordEncrypt = string => {
    const cryptr = new Cryptr(globalConfig.get('/').passSecret)
    return cryptr.encrypt(string)
}

const passwordDecrypt = string => {
    const cryptr = new Cryptr(globalConfig.get('/').passSecret)
    return cryptr.decrypt(string)
}

const pinEncrypt = string => {
    const cryptr = new Cryptr(globalConfig.get('/').passSecret)
    return cryptr.encrypt(string)
}

const pinDecrypt = string => {
    const cryptr = new Cryptr(globalConfig.get('/').passSecret)
    return cryptr.decrypt(string)
}

module.exports ={
    passwordEncrypt,
    passwordDecrypt,
    pinEncrypt,
    pinDecrypt
}