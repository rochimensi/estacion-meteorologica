let config = require('../config');

class ConfigsController {

  async changeBaudios(req, res) {

  }

  async changeChannel(req, res) {

  }

  async changeDelay(req, res) {

  }

  getScan(req, res, app) {
    app.serial.scan(req.query.inicio, req.query.fin);
  }
}

let singleton = new ConfigsController();

module.exports = singleton;
