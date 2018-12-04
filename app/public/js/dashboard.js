var temp_yellowFrom =24;
var temp_yellowTo =30;
var temp_redFrom =30;
var temp_redTo =46;

var hum_yellowFrom =800;
var hum_yellowTo = 1200;
var hum_redFrom =1200;
var hum_redTo = 1511;

var viento_yellowFrom =170;
var viento_yellowTo = 200;
var viento_redFrom =200;
var viento_redTo = 253;

var dataTemp, dataViento, dataHum, chartTemp, chartViento, chartHum;

var optionsHum = {
  width: 200, height: 200,
  yellowFrom: hum_yellowFrom, yellowTo: hum_yellowTo,
  redFrom: hum_redFrom, redTo: hum_redTo,
  minorTicks: 5,
  max: 1511
};

var optionsTemp = {
  width: 200, height: 200,
  yellowFrom: temp_yellowFrom, yellowTo: temp_yellowTo,
  redFrom: temp_redFrom, redTo: temp_redTo,
  minorTicks: 5,
  max: 46
};

var optionsViento = {
  width: 200, height: 200,
  yellowFrom: viento_yellowFrom, yellowTo:viento_yellowTo,
  redFrom: viento_redFrom, redTo: viento_redTo,
  minorTicks: 5,
  max: 253
};

function setDigitalSensorPage(){
  $("#main").load("digitalSensor.html");
}

function setSetupPage(){
  $.ajax("setup.html", function(data){
    $("#main").html(data);
  });
}

// canvas request for all browsers
window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 30); // 30 frames per second
    };
})();

window.onload = function() {
  initSocketIO();
  google.charts.load('current', {'packages':['gauge']});
  google.charts.setOnLoadCallback(drawChart);
};

function colorAlert(recievedData, tdId, redFrom, yellowFrom) {
  if (recievedData > redFrom){
    document.getElementById(tdId).style.backgroundColor = "#DC3912";
  }
  else  if (recievedData < redFrom && recievedData > yellowFrom){
    document.getElementById(tdId).style.backgroundColor = "#FF9900";
  }
  else {
    document.getElementById(tdId).style.backgroundColor = "#38c766";
  }
}

function drawChart() {
  dataTemp = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Temperatura', 0],
  ]);

  dataViento = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Viento', 0],
  ]);

  dataHum = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Humedad', 0]
  ]);

  chartTemp = new google.visualization.Gauge(document.getElementById('chartTemp_div'));
  chartViento = new google.visualization.Gauge(document.getElementById('chartViento_div'));
  chartHum = new google.visualization.Gauge(document.getElementById('chartHum_div'));


  chartTemp.draw(dataTemp, optionsTemp);
  chartViento.draw(dataHum, optionsHum);
  chartHum.draw(dataViento, optionsViento);
}

/* SOCKETS */

function initSocketIO() {
  var iosocket = io.connect('http://localhost');

  iosocket.on('updateViento', recievedData => {
    //colorAlert(recievedData, "td3", viento_redFrom, viento_yellowFrom);
    dataViento.setValue(0, 1, parseInt(recievedData));
    chartViento.draw(dataViento, optionsViento);
  });

  iosocket.on('updateHumedad', recievedData => {
    //colorAlert(recievedData, "td2", hum_redFrom, hum_yellowFrom);
    dataHum.setValue(0, 1, parseInt(recievedData));
    chartHum.draw(dataHum, optionsHum);
  });

  iosocket.on('updateTemperatura', recievedData => {
    //colorAlert(recievedData, "td1", temp_redFrom, temp_yellowFrom);
    dataTemp.setValue(0, 1, parseInt(recievedData));
    chartTemp.draw(dataTemp, optionsTemp);
  });
}