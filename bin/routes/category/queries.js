const connection = require('../../helpers/databases/mysql/mysql').connection
const config = require('../../configs/globalConfigs');
const Mongo = require('../../helpers/databases/mongodb/db');
const db = new Mongo(config.get('/mongoDbUrl'));

const findManyCategory = async () => {
    db.setCollection('category');
    const recordset = await db.findMany();
    return recordset;
}; 

const updateOneCategory = async (params, document) => {
    db.setCollection('category');
    const recordset = await db.updateOneField(params, document);
    return recordset;
}; 

const findOneCategoryByCategoryId = async (categoryId) => {
    db.setCollection('category');
    const params = {
        categoryId
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const findOneCategoryByCategoryName= async (categoryName) => {
    db.setCollection('category');
    const params = {
        categoryName
    }
    console.log(params)
    const recordset = await db.findOne(params);
    return recordset;
}; 

const insertOneCategory = async (body) => {
    db.setCollection('category');
    const recordset = await db.insertOne(body);
    return recordset;
};

const deleteOneCategoryByCategoryId = async (categoryId) => {
    db.setCollection('category');
    const params = {
        categoryId
    }
    const recordset = await db.deleteOne(params);
    return recordset;
}; 

const findAllCategory = async (sort,sizes,pages,filters) => {
    db.setCollection('category');
    const recordset = await db.findAllDataNew(sort,sizes,pages,filters);
    return recordset;
};

const countDataCategory = async (param) => {
    db.setCollection('category');
    const recordset = await db.countData(param);
    return recordset;
};


module.exports = {
    findManyCategory,
    insertOneCategory,
    updateOneCategory,
    findOneCategoryByCategoryId,
    deleteOneCategoryByCategoryId,
    findAllCategory,
    countDataCategory,
    findOneCategoryByCategoryName
}