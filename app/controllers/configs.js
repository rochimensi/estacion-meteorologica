let config = require('../config');

class ConfigsController {

  async changeChannel(req, res) {

  }

  changeDelay(req, res, app) {
    const delay = req.query.delay;
    app.serial.write(`TIME(${delay})`);
    res.sendStatus(200);
  }

  setLed(req, res, app) {
    const ledPin = config.settings.leds[req.query.colorLed];
    const state = req.query.valor;
    app.serial.wrdo(ledPin, state);
    res.sendStatus(200);
  }

  getScan(req, res, app) {
    const inicio = config.settings.barrido.inicio;
    const fin = config.settings.barrido.fin;
    app.serial.scan(inicio, fin);
    res.sendStatus(200);
  }

  getIden(req, res, app) {
    let iden = app.serial.iden(req.query.inicio, req.query.fin);
    res.sendStatus(200);
  }
}

let singleton = new ConfigsController();

module.exports = singleton;
