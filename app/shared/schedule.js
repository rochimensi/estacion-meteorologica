let CronJob = require('cron').CronJob;
let config = require( "../config");
let logger = require( '../utils/logger');

class ScheduleService {
  scheduleLedsOn(serial, moment) {
    console.log("Registrando evento para prender las luces..");
    new CronJob(moment, function() {
      serial.wrdo(config.settings.leds.rojo, 1);
      serial.wrdo(config.settings.leds.verde, 1);
    }, null, true, 'America/Argentina/Buenos_Aires');
  }
}

let singleton = new ScheduleService();

module.exports = singleton;

