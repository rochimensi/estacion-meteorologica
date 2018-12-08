let cron = require('cron').CronJob;
let config = require( "../config");
let logger = require( '../utils/logger');

class ScheduleService {
  createCron(app, time, job) {
    console.log("Registrando evento para prender las luces..");
    if (job)
        job.stop();
    
    if(time){
        time = time.split(':');

        job = new cron(time[1] + ' ' + time[0] +' * * *', () => {
            app.serial.wrdo("6", 1);
        }, undefined, true, "America/Argentina/Buenos_Aires");

    }
  }
}

let singleton = new ScheduleService();

module.exports = singleton;

