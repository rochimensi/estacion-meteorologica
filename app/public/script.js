window.onload = function() {
  initSocketIO();
};

function initSocketIO() {
  var socket = io.connect('http://localhost');
  socket.on("connection", function () {
    console.log(socket);
  });
  socket.on('updateViento', function (data) {
    console.log("Viento: ", data);
  });
  socket.on('updateHumedad', function (data) {
    console.log("Humedad: ", data);
  });
  socket.on('updateTemperatura', function (data) {
    console.log("Temperatura: ", data);
  });
}
