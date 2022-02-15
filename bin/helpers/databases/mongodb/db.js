const validate = require('validate.js');
const mongoConnection = require('./connection');
const helper = require('../../helper');
const logger = require('../../logger');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    /* eslint no-useless-escape: "error" */
    const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findMany() {
    const ctx = 'mongodb-findMany';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.find({})
        .toArray();
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', state);
      }
      
      return helper.responseCode(0, 'Success get all user!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error get data in mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async findOne(parameter) {
    const ctx = 'mongodb-findOne';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.find(parameter)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', false, 'fail');
      }
      
      return helper.responseCode(0, 'Success get data!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error get data in mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async findAllData(parameter, sort) {
    const ctx = 'mongodb-findAllData';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.find(parameter).sort(sort)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', false, 'fail');
      }
      
      return helper.responseCode(0, 'Success get data!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error get data in mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async findAllDataNew(fieldName, row, page, param) {
    const ctx = 'mongodb-findAllDataNew';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const parameterPage = row * (page - 1);
      const recordset = await db.find(param).sort(fieldName).limit(row).skip(parameterPage)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', false, 'fail');
      }
      
      return helper.responseCode(0, 'Success get data!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error get data in mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async countData(parameter) {
    const ctx = 'mongodb-countData';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.count(parameter);
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', false, 'fail');
      }
      
      return helper.responseCode(0, 'Success get data!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error get data in mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async insertOne(body) {
    const ctx = 'mongodb-insertOne';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.insertMany([body])
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', state);
      }
      
      return helper.responseCode(0, 'success insert!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error insert data to mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async deleteOne(param) {
    const ctx = 'mongodb-deleteOne';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.deleteOne(param)
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', state);
      }
      
      return helper.responseCode(0, 'success delete data!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error delete data to mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async findRandomDocument(parameter) {
    const ctx = 'mongodb-findRandomDocument';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const recordset = await db.aggregate([{ $match: parameter },{ $sample: { size: 1 } }]).toArray();
      if (validate.isEmpty(recordset)) {
        return helper.responseCode(404, 'Please Try Another Input', state);
      }
      
      return helper.responseCode(0, 'success get random data!', recordset)

    } catch (err) {
      logger.log(ctx, err.message, 'Error get random data from mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

  async updateOneField(parameter, set) {
    const ctx = 'mongodb-updateOneField';
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return content;
    }
    try {
      const db = result.collection(this.collectionName);
      const data = await db.update(parameter, { $set: set}, {upsert:true})
      if (data.result.nModified >= 0) {
        const { result: { nModified } } = data;
        const recordset = await this.findOne(parameter);
        if (nModified === 0) {
          return helper.responseCode(0, 'Created!', recordset.data)
        }
        return helper.responseCode(0, 'Updated!', recordset.data)

      }
      return helper.responseCode(409, 'Failed upsert data', '');
    } catch (err) {
      logger.log(ctx, err.message, 'Error insert data to mongodb');
      return helper.responseCode(409, `Error Mongo ${err.message}`, false);
    }


  }

}

module.exports = DB;
