const workerEventHandler = require('./event_handler');
const logger = require('../helpers/logger');

const init = () => {
    logger.log('info','Observer is Running...','myEmitter.init');
    initEventListener();
  };
  const initEventListener = () => {
    workerEventHandler.orderProcess()
  };
  
  module.exports = {
    init: init
  };