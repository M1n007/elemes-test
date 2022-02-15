const connection = require('../../helpers/databases/mysql/mysql').connection
const config = require('../../configs/globalConfigs');
const Mongo = require('../../helpers/databases/mongodb/db');
const db = new Mongo(config.get('/mongoDbUrl'));

const findManyUsers = async () => {
    db.setCollection('users');
    const recordset = await db.findMany();
    return recordset;
}; 

const updateOneUser = async (params, document) => {
    db.setCollection('users');
    const recordset = await db.updateOneField(params, document);
    return recordset;
}; 

const findOneUserByEmail = async (email) => {
    db.setCollection('users');
    const params = {
        email
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const findOneUserByphoneNumber = async (phoneNumber) => {
    db.setCollection('users');
    const params = {
        phoneNumber
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const findOneUserByUserId = async (userId) => {
    db.setCollection('users');
    const params = {
        userId
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const insertOneUser = async (body) => {
    db.setCollection('users');
    const recordset = await db.insertOne(body);
    return recordset;
};

const deleteOneUserByUserId = async (userId) => {
    db.setCollection('users');
    const params = {
        userId
    }
    const recordset = await db.deleteOne(params);
    return recordset;
}; 


const countDataUser = async (param) => {
    db.setCollection('users');
    const recordset = await db.countData(param);
    return recordset;
};


module.exports = {
    findManyUsers,
    insertOneUser,
    findOneUserByEmail,
    findOneUserByphoneNumber,
    updateOneUser,
    findOneUserByUserId,
    deleteOneUserByUserId,
    countDataUser
}