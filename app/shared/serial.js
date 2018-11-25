let config = require("../config");
let logger = require("../utils/logger");
let Email = require("../shared/email");

const SerialPort = require("serialport");

let nroMuestrasFaltantes = 0;
let receivedData = "";

module.exports = class Serial {

  constructor(socket, canal, baudios, delay) {
    canal = canal || "COM3";
    baudios = baudios || 9600;
    delay = delay || 1000;

    this.serialPort = new SerialPort(canal, {
      baudRate: baudios,
      // defaults para comunicacion serial Arduino
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      flowControl: false
    });

    receivedData = "";
/*
    setInterval(() => {
      nroMuestrasFaltantes++;
      if (nroMuestrasFaltantes === 5) {
        logger.info("Enviando alerta de muestras faltantes..");
        //Email.sendMuestrasFaltantesAlert(config.users.admin);
      }
    }, delay);*/

    this.serialPort.on("open", () => {
      logger.log("Comunicacion Serial abierta..");

      this.serialPort.on("data", (data) => {

        let sendData = "";
        nroMuestrasFaltantes = 0;
        receivedData = data.toString();

        logger.info("[Data] ", receivedData);

        receivedData = receivedData.split('/');

        receivedData.forEach(r => {

          if (r.indexOf('V') >= 0) {
            sendData = r.substring(r.indexOf('V') + 1, r.length);
            socket.emit('updateViento', sendData);
          }
          if (r.indexOf('H') >= 0) {
            sendData = r.substring(r.indexOf('H') + 1, r.length);
            socket.emit('updateHumedad', sendData);
          }
          if (r.indexOf('T') >= 0) {
            sendData = r.substring(r.indexOf('T') + 1, r.length);
            socket.emit('updateTemperatura', sendData);
          }

        })
      });
    });

  }

  scan(inicio, fin) {
    console.log(`SCAN(${inicio},${fin})\n`);
    //this.serialPort.write(`SCAN(${inicio},${fin})\n`);
  }

  write(data) {
    this.serialPort.write(data);
  }
};

