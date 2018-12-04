let config = require("../config");
let logger = require("../utils/logger");
let Email = require("../shared/email");
let EventsController = require("../controllers/event");

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

    this.serialPort.on("open", () => {
      logger.log("Comunicacion Serial abierta..");

      this.serialPort.on("data", (data) => {

        let sendData = "";
        nroMuestrasFaltantes = 0;
        receivedData = data.toString();

        logger.info("[Data] ", receivedData);

        receivedData = receivedData.split("/");

        receivedData.forEach(r => {

          if (r.indexOf("V") == 0) {
            sendData = r.substring(r.indexOf("V") + 1, r.length);
            socket.emit("updateViento", sendData);
            EventsController.post({sensor: "viento", valor: sendData});
            if(sendData > config.settings.umbrales.vientoSup) {
              Email.sendUmbralAlert("Viento", false, true, sendData, "m/s");
            }
            if(sendData < config.settings.umbrales.vientoInf) {
              Email.sendUmbralAlert("Viento", true, false, sendData, "m/s");
            }
          }
          if (r.indexOf("H") == 0) {
            sendData = r.substring(r.indexOf("H") + 1, r.length);
            socket.emit("updateHumedad", sendData);
            EventsController.post({sensor: "humedad", valor: sendData});
            if(sendData > config.settings.umbrales.humSup) {
              Email.sendUmbralAlert("Humedad", false, true, sendData, "%RH");
            }
            if(sendData < config.settings.umbrales.humInf) {
              Email.sendUmbralAlert("Humedad", true, false, sendData, "%RH");
            }
          }
          if (r.indexOf("T") == 0) {
            sendData = r.substring(r.indexOf("T") + 1, r.length);
            socket.emit("updateTemperatura", sendData);
            EventsController.post({sensor: "temperatura", valor: sendData});
            if(sendData > config.settings.umbrales.tempSup) {
              Email.sendUmbralAlert("Temperatura", false, true, sendData, "C");
            }
            if(sendData < config.settings.umbrales.tempInf) {
              Email.sendUmbralAlert("Temperatura", true, false, sendData, "C");
            }
          }

          if(r.indexOf("IDEN") > -1) {
            sendData = r.substring(r.indexOf("IDEN") + 4, r.length);
            socket.emit("updateStatus", sendData);
          }

          if(r.indexOf("SCAN") > -1) {
            sendData = r.substring(r.indexOf("SCAN") + 4, r.length);
            socket.emit("updateScan", sendData);
          }

          if(r.indexOf("GABI") > -1) {
            sendData = r.substring(r.indexOf("GABI") + 4, r.length);
            const abierto = !parseInt(sendData);
            socket.emit("updateGabinete", abierto);
            if(abierto) {
              Email.sendGabineteAbiertoAlert();
            }
          }

          if(r.indexOf("SUMIN") > -1) {
            sendData = r.substring(r.indexOf("SUMIN") + 5, r.length);
            const corte = !parseInt(sendData);
            socket.emit("updateSuministro", corte);
            if(corte) {
              Email.sendCorteElectricoAlert();
            }
          }
        })
      });
    });

  }

  iden() {
    logger.info("[Command] Running IDEN");
    this.serialPort.write("IDEN\n");
  }

  scan(inicio, fin) {
    logger.info("[Command] Running SCAN");
    this.serialPort.write(`SCAN(${inicio},${fin})\n`);
  }

  wrdo(ledPin, state) {
    logger.info("[Command] Running WRDO");
    this.serialPort.write(`WRDO(${ledPin},${state})\n`);
  }

  write(data) {
    logger.info("[Command] Running write");
    this.serialPort.write(data + "\n");
  }
};

