const connection = require('../../helpers/databases/mysql/mysql').connection
const config = require('../../configs/globalConfigs');
const Mongo = require('../../helpers/databases/mongodb/db');
const db = new Mongo(config.get('/mongoDbUrl'));

const insertOneMedia = async (body) => {
    db.setCollection('media');
    const recordset = await db.insertOne(body);
    return recordset;
};

module.exports = {
    insertOneMedia
}