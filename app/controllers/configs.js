let config = require('../config');
let schedule = require('../shared/schedule');

class ConfigsController {

  setAlerts(req, res) {
    let state = req.query.valor;
    if(state === "true") state = true;
    if(state === "false") state = false;
    config.alerts.toggleEmails = state;
    res.sendStatus(200);
  }

  setEmail(req, res) {
    config.alerts.email = req.query.email;
    res.sendStatus(200);
  }

  setTempUmbrales(req, res) {
    config.settings.umbrales.tempInf = req.query.inferior;
    config.settings.umbrales.tempSup = req.query.superior;
    res.sendStatus(200);
  }

  setTempUmbrales(req, res) {
    config.settings.umbrales.tempInf = req.query.inferior;
    config.settings.umbrales.tempSup = req.query.superior;
    res.sendStatus(200);
  }

  setVientoUmbrales(req, res) {
    config.settings.umbrales.vientoInf = req.query.inferior;
    config.settings.umbrales.vientoSup = req.query.superior;
    res.sendStatus(200);
  }

  setHumedadUmbrales(req, res) {
    config.settings.umbrales.humInf = req.query.inferior;
    config.settings.umbrales.humSup = req.query.superior;
    res.sendStatus(200);
  }

  setTempFuncion(req, res, app) {
    const A = req.query.a;
    const B = req.query.b;
    const C = req.query.c;
    app.serial.write(`TEMA(${A})`);
    app.serial.write(`TEMB(${B})`);
    app.serial.write(`TEMC(${C})`);
    res.sendStatus(200);
  }

  setVientoFuncion(req, res, app) {
    const A = req.query.a;
    const B = req.query.b;
    const C = req.query.c;
    app.serial.write(`VIEA(${A})`);
    app.serial.write(`VIEB(${B})`);
    app.serial.write(`VIEC(${C})`);
    res.sendStatus(200);
  }

  setHumedadFuncion(req, res, app) {
    const A = req.query.a;
    const B = req.query.b;
    const C = req.query.c;
    app.serial.write(`HUMA(${A})`);
    app.serial.write(`HUMB(${B})`);
    app.serial.write(`HUMC(${C})`);
    res.sendStatus(200);
  }

  setLedSchedule(req, res, app) {
    res.sendStatus(200);
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

   setLedTime(req, res, app) {
    const time = req.query.time;
    schedule.createCron(app, time);
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
