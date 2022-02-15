const Mongo = require('mongodb').MongoClient;
const helper = require('../../helper');
const config = require('../../../configs/globalConfigs');
const logger = require('../../logger');

const getConnection = async () => {
  const options = { poolSize: 50,
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  try {
    const connection = await Mongo.connect(config.get('/mongoDbUrl'), options);
    logger.log('mongodb-connection', 'success', 'info');
    return connection.db()
  } catch (err) {
    logger.log('connection-createConnection', err, 'error');
    return helper.responseCode(503, err.message)
  }
};

const init = () => {
  getConnection();
};

module.exports = {
  init,
  getConnection
};
