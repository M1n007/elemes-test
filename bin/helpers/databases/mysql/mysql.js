const globalConfig = require('../../../configs/globalConfigs')
const mysql = require('mysql2');

const connection = mysql.createPool(globalConfig.get('/mysqlConnection'));
module.exports = {
    connection
}