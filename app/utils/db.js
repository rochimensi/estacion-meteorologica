let mongoose = require('mongoose');
let config = require('../config');
let logger = require('./logger');

mongoose.Promise = global.Promise;

const connection = mongoose.connect(config.database.uri, { useNewUrlParser: true });

connection
	.then(db => {
		logger.info(`[MongoDB] Successfully connected to ${config.database.uri}.`);
		return db;
	})
	.catch(err => {
		if (err.message.code === 'ETIMEDOUT') {
			logger.info('[MongoDB] Attempting to re-establish database connection.');
			mongoose.connect(config.database.uri, { useNewUrlParser: true });
		} else {
			logger.error('[MongoDB] Error while attempting to connect to database:');
			logger.error(err);
		}
	});

mongoose.set("debug", true);

module.exports = connection;
