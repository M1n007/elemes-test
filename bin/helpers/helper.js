const jwt = require('jsonwebtoken')
const moment = require('moment')
const globalConfig = require('../configs/globalConfigs');
const nodemailer = require('nodemailer');
const rp = require('request-promise');
const momentTimezone = require('moment-timezone');

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const dateNow = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

const justDate = () => {
    return moment().format('YYYY-MM-DD')
}

const dateFormat = date =>{
    return moment(date).format('YYYY-MM-DD');
}

const dateMinus = minus => {
    var startdate = moment()
    startdate = startdate.subtract(minus, "days")
    return startdate.format("YYYY-MM-DD");
}

const datePlus = (now, plus) => {
    const newDate = moment(now, "YYYY-MM-DD HH:mm:ss").add(plus, 'hours');
    let Y = newDate.format('YYYY');
    let M = newDate.format('MM');
    let D = newDate.format('DD');
    let H = newDate.format('HH');
    let I = newDate.format('mm');
    let S = newDate.format('ss');
    return `${Y}-${M}-${D} ${H}:${I}:${S}`
}

const response = (status, code, msg, result, err) => {
    return {
        status,
        result: {
            resultCode: code,
            resultDesc: msg,
            content: result,
            timeStamp: dateNow()
        },
        err
    }
}

const responseCode = (code, message, value, err = false) => {
    switch (code) {
        case 0:
            return response(200, 0, message, value, err == 'fail' ? true : false)
            break;
        case 200:
            return response(200, 200, message, value, err == 'fail' ? true : false)
            break;
        case 401:
            return response(401, 401, !message ? 'UnauthorizedError!' : message, false, err == 'fail' ? true : false)
            break;
        case 409:
            return response(409, 409, !message ? 'Conflict!' : message, false, err == 'fail' ? true : false)
            break;
        case 404:
            return response(404, 404, !message ? 'Not Found!' : message, !value ? false : value, err == 'fail' ? true : false)
            break;
        case 409:
            return response(409, 409, !message ? 'Duplicate!' : message, !value ? false : value, err == 'fail' ? true : false)
            break;
        case 403:
            return response(403, 403, !message ? 'Forbidden!' : message, false, err == 'fail' ? true : false)
            break;
        case 400:
            return response(400, 400, !message ? 'Bad Request!' : message, !value ? false : value, err == 'fail' ? true : false)
            break;
        default:
            return response(500, 500, 'Internal Server Error!', false, err == 'fail' ? true : false)
    }
}

const badRequest = param => {
    return {
        resultCode: 400,
        resultDesc: 'Bad Request!',
        content: param,
        timeStamp: dateNow()
    }
}

const pagination = (array, page, max) => {
    return array.slice((page - 1) * max, page * max);
}

const paginationCheck = (param, totalData) => {
    let totalLoad = param.max * param.page
    if (totalLoad >= totalData) {
        return null
    } else {
        return parseInt(param.page) + 1
    }
}

const createToken = payload => {
    return jwt.sign(payload, globalConfig.get('/').jwtSecret, { expiresIn: '1d' })
}

const arrayRemoveByValue = (array, remove) => {
    var index = array.indexOf(remove);
    if (index !== -1) array.splice(index, 1);
    return array
}

const mailerTransporter = async () => {
    return nodemailer.createTransport(globalConfig.get('/smtp'));
};

const getHtmlLetter = (uri) => {
    const res = rp.get(uri)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
    return res;
}

const generateTime = () => {
    let now = momentTimezone(new Date());
  
    let nowJkt = now.tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return nowJkt;
  };
  

function logEvent(name) {
    return (data) => {data, name};
}

function isValidUrl(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;  
    }
  
    return true;
  }

  function logEvent(name) {
    return (data) => {data, name};
}

function generateChar(length) {
    var text = "";
    var possible =
        "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
}

module.exports = {
    dateNow,
    justDate,
    dateFormat,
    dateMinus,
    datePlus,
    response,
    responseCode,
    badRequest,
    pagination,
    paginationCheck,
    createToken,
    arrayRemoveByValue,
    mailerTransporter,
    getHtmlLetter,
    generateTime,
    logEvent,
    isValidUrl,
    generateChar,
    randomNumber
}