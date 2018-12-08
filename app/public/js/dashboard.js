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
    dataViento.setValue(0, 1, parseInt(recievedData));
    chartViento.draw(dataViento, optionsViento);
  });

  iosocket.on('updateHumedad', recievedData => {
    dataHum.setValue(0, 1, parseInt(recievedData));
    chartHum.draw(dataHum, optionsHum);
  });

  iosocket.on('updateTemperatura', recievedData => {
    dataTemp.setValue(0, 1, parseInt(recievedData));
    chartTemp.draw(dataTemp, optionsTemp);
  });

  iosocket.on('updateGabinete', recievedData => {
    if (recievedData){
       $("#stat-gabi").attr('class', 'circle');
       $("#stat-gabi-text").text('CERRADO');
    }else{
       $("#stat-gabi").attr('class', 'circle-active');
       $("#stat-gabi-text").text('ABIERTO');
    }
  });

  iosocket.on('updateSuministro', recievedData => {
     if (recievedData){
       $("#stat-sum").attr('class', 'circle');
       $("#stat-sum-text").text('ABIERTO');
    }else{
       $("#stat-sum").attr('class', 'circle-active');
       $("#stat-sum-text").text('CERRADO');
    }
  });


  iosocket.on('updateStatus', recievedData => {
     $("#func-status").text(recievedData);
  });
  
  iosocket.on('updateScan', recievedData => {
    var res = recievedData.split(";");
    $("#scan-viento").text(res[0]);
    $("#scan-temp").text(res[2]);
    $("#scan-hum").text(res[1]);
  });
}


$(document).ready(function (){
  $('input[type=checkbox]').click(function(){

       if (this.id == "temp-on"){
           if (this.checked){
              $("#chartTemp_div").css("visibility", "");
              $("#temp_not_available").css("visibility", "hidden");
           }else{
              $("#chartTemp_div").css("visibility", "hidden");
              $("#temp_not_available").css("visibility", "");
           }
       }else if (this.id ==  "hum-on"){
          if (this.checked){
              $("#chartHum_div").css("visibility", "");
              $("#hum_not_available").css("visibility", "hidden");
           }else{
              $("#chartHum_div").css("visibility", "hidden");
              $("#hum_not_available").css("visibility", "");
           }
       }else if (this.id ==  "viento-on"){
           if (this.checked){
              $("#chartViento_div").css("visibility", "");
              $("#viento_not_available").css("visibility", "hidden");
           }else{
              $("#chartViento_div").css("visibility", "hidden");
              $("#viento_not_available").css("visibility", "");
           }
       }
     
  }); 

//SCAN
$("#id-scan").click(function(event) {
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/scan", 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

//STATUS
$("#id-func").click(function(event) {
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/status", 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

 //TIEMPO MUESTRA
 $("#id-muestra").click(function(event) {
  var seconds = $("#muestras-seg").val();
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/delay?delay="+seconds, 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });


 //ENCENDIDO
 $("#luz-butt").click(function(event) {
  var time = $("#meeting-time").val();
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/led-time?time="+time, 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

 //EMAIL ALARMAS
 $("#email-butt").click(function(event) {
  var email = $("#email-alarm").val();
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/alerts-email?email="+email, 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

  //ESTADO ALARMA  /alerts
 $("#estado-alarma").click(function(event) {
    var valor = "false";
    if( $(this).is(':checked') ){
        valor = "true";
        $(this).prop("checked",true);
    } else {
        valor = "false";
        $(this).prop("checked",false);
    }
   
    event.preventDefault(); 
    $.ajax({ 
       type:'GET', 
       url :"http://localhost:4000/configs/alerts?valor="+valor,
       headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
       success: function(status) { 
       console.log("Status " + status); 
       } 
      }); 
 });


  //LUZ VERDE http://localhost:4000/configs/led?colorLed=verde&valor=1
 $("#luz-verde-on").click(function(event) {
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/led?colorLed=verde&valor=1", 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

  $("#luz-verde-off").click(function(event) {
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/led?colorLed=verde&valor=0", 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

 $("#luz-roja-on").click(function(event) {
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/led?colorLed=rojo&valor=1", 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

  $("#luz-roja-off").click(function(event) {
  event.preventDefault(); 
  $.ajax({ 
     type:'GET', 
     url :"http://localhost:4000/configs/led?colorLed=rojo&valor=0", 
     headers : { "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDQwNTg5Mzl9.Lh1aNIySDq63mcP2QaxNgHC4S35Ww9U7FcjhILAXDfU" }, 
     success: function(status) { 
     console.log("Status " + status); 
     } 
    }); 
 });

});

