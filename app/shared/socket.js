const config = require("../config");
const logger = require("../utils/logger");
const socketio = require('socket.io');
const http = require('http');

module.exports = class Socket {

  constructor(app) {
    const server = http.Server(app);
    server.listen(80);
    this.io = socketio(server);
  }

  connectionHandler() {
    return new Promise((resolve, reject) => {
      this.io.on('connection', (socket) => {
        logger.log("Cliente conectado");

//    socket.emit('onconnection', {pollOneValue: sendData});

        /*socket.on('toggleLed', data => {
         serial.write(data + 'L');
         });*/

        socket.on('updateViento', recievedData => {
          console.log('Viento', recievedData);
        });

        socket.on('updateHumedad', recievedData => {
          console.log('Humedad', recievedData);
        });

        socket.on('updateTemperatura', recievedData => {
          console.log('Temperatura', recievedData);
        });

        resolve(socket);


        /*    socket.on('buttonval', (data) => {
         serial.write(data + 'E');
         });*/
      });
    });
  }

};

