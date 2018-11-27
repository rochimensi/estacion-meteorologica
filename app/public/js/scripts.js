window.onload = function() {
  initSocketIO();
};

function initSocketIO() {
  var socket = io.connect('http://localhost');
  socket.on("connection", function () {
    console.log(socket);
  });
  socket.on('updateViento', function (data) {
    console.log("Viento: ", data, " m/s");
  });
  socket.on('updateHumedad', function (data) {
    console.log("Humedad: ", data);
  });
  socket.on('updateTemperatura', function (data) {
    console.log("Temperatura: ", data);
  });
  socket.on('updateStatus', function (data) {
    console.log("Status: ", data);
  });
  socket.on('updateScan', function (data) {
    console.log("Scan: ", data);
  });
  socket.on('updateGabinete', function (data) {
    console.log("Abierto: ", data);
  });
  socket.on('updateSuministro', function (data) {
    console.log("Corte electrico: ", data);
  });
}
