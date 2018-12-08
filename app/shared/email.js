let nodemailer = require( "nodemailer");
let config = require( "../config");
let logger = require( '../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.email,
        pass: config.email.password
      },
      tls: {
          rejectUnauthorized: false
      }
    });
  }

  sendAlert(emailTemplate, subject) {
    if (config.alerts.triggerEmails) {
      let mailOptions = {
        from: config.email.email,
        to: config.alerts.email,
        subject: subject,
        html: emailTemplate
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error("Error enviando alerta por email. ", error);
        } else {
          logger.log('Email de alerta enviado: ' + info.response);
        }
      });
    }
  }

  sendUmbralAlert(sensor, inferior, superior, valor, unidad) {
    let umbral = inferior ? "inferior" : "superior";
    let emailTemplate = "<h1>Estación Meteorológica</h1>";
    emailTemplate += `<p>El sensor de ${sensor} pasó el umbral ${umbral}. Valor: ${valor}${unidad}</p>`;
    this.sendAlert(emailTemplate, `[Alerta] Umbral de ${sensor} pasó el umbral ${umbral}.`);
  }

  sendCorteElectricoAlert() {
    let emailTemplate = "<h1>Estación Meteorológica</h1>";
    emailTemplate += "<p>Ha ocurrido un corte en el suministro eléctrico provisto por la celda de energía solar.</p>";
    this.sendAlert(emailTemplate, '[Alerta] Corte de suministro eléctrico en estación meteorológica');
  }

  sendGabineteAbiertoAlert() {
    let emailTemplate = "<h1>Estación Meteorológica</h1>";
    emailTemplate += "<p>Se ha abierto el gabinete.</p>";
    this.sendAlert(emailTemplate, '[Alerta] Corte de suministro eléctrico en estación meteorológica');
  }
}

let singleton = new EmailService();

module.exports = singleton;
