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
      }
    });
  }

  sendMuestrasFaltantesAlert(to) {

    let emailTemplate = "";

    let mailOptions = {
      from: config.email.email,
      to: to,
      subject: 'Alertaaaa',
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

let singleton = new EmailService();

module.exports = singleton;
