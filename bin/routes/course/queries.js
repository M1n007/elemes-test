const connection = require('../../helpers/databases/mysql/mysql').connection
const config = require('../../configs/globalConfigs');
const Mongo = require('../../helpers/databases/mongodb/db');
const db = new Mongo(config.get('/mongoDbUrl'));

const findManyCourse = async () => {
    db.setCollection('course');
    const recordset = await db.findMany();
    return recordset;
}; 

const updateOneCourse = async (params, document) => {
    db.setCollection('course');
    const recordset = await db.updateOneField(params, document);
    return recordset;
}; 

const findOneCourseBySlug = async (slug) => {
    db.setCollection('course');
    const params = {
        slug
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const findOneCourseByphoneNumber = async (phoneNumber) => {
    db.setCollection('course');
    const params = {
        phoneNumber
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const findOneCourseByCourseId = async (courseId) => {
    db.setCollection('course');
    const params = {
        courseId
    }
    const recordset = await db.findOne(params);
    return recordset;
}; 

const insertOneCourse = async (body) => {
    db.setCollection('course');
    const recordset = await db.insertOne(body);
    return recordset;
};

const deleteOneCourseByCourseId = async (courseId) => {
    db.setCollection('course');
    const params = {
        courseId
    }
    const recordset = await db.deleteOne(params);
    return recordset;
}; 

const findAllCourse = async (sort,sizes,pages,filters) => {
    db.setCollection('course');
    const recordset = await db.findAllDataNew(sort,sizes,pages,filters);
    return recordset;
};

const countDataCourse = async (param) => {
    db.setCollection('course');
    const recordset = await db.countData(param);
    return recordset;
};


module.exports = {
    findManyCourse,
    insertOneCourse,
    findOneCourseBySlug,
    findOneCourseByphoneNumber,
    updateOneCourse,
    findOneCourseByCourseId,
    deleteOneCourseByCourseId,
    findAllCourse,
    countDataCourse
}