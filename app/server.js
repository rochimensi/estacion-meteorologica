let fs = require('fs');
let path = require('path');
let express = require("express");
let bodyParser = require('body-parser');
let cors = require('cors');
let compression = require('compression');
let config = require('./config');
let logger = require('./utils/logger');
let Serial = require("./shared/serial");
let Socket = require("./shared/socket");

const app = express();

require('express-async-errors');

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


fs.readdirSync(path.join(__dirname, 'routes')).map(file => {
  require('./routes/' + file)(app);
});

/* Errors middleware */
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Missing authentication credentials.');
  }

  if (err.name === 'ValidationError') {
    res.status(400).send(err);
  }

  next(err);
});

/* Server setup */
app.listen(config.server.port, err => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}

	require('./utils/db');

	logger.info(`[Server] API is now running on port ${config.server.port} in ${config.env} mode`);

  app.socket = new Socket(app);
  app.socket.connectionHandler().then(socket => {
    app.serial = new Serial(socket);
  });
});

module.exports = app;
