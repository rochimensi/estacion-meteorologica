      google.charts.load('current', {'packages':['gauge']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        //umbrales temperatura,humedad,viento
        var temp_yellowFrom =40;
        var temp_yellowTo =90;
        var hum_yellowFrom =40;
        var hum_yellowTo = 90;
        var viento_yellowFrom =20;
        var viento_yellowTo = 60;
        var temp_redFrom =45;
        var temp_redTo =100;
        var hum_redFrom =90;
        var hum_redTo = 100;
        var viento_redFrom =60;
        var viento_redTo = 100;

        var dataTemp = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Temperatura', 32],
        ]);
        
        var dataViento = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Viento', 55],
        ]);
        
        var dataHum = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Humedad', 68]
        ]);

        var optionsHum = {
          width: 400, height: 400,
          yellowFrom: hum_yellowFrom, yellowTo:hum_yellowTo,
          redFrom: hum_redFrom, redTo: hum_redTo,
          minorTicks: 5
        };
     
        var optionsTemp = {
          width: 400, height: 400,
          yellowFrom: temp_yellowFrom, yellowTo:temp_yellowTo,
          redFrom: temp_redFrom, redTo: temp_redTo,
          minorTicks: 5
        };
        
        var optionsViento = {
          width: 400, height: 400,
          yellowFrom: viento_yellowFrom, yellowTo:viento_yellowTo,
          redFrom: viento_redFrom, redTo: viento_redTo,
          minorTicks: 5
        };

        var chartTemp = new google.visualization.Gauge(document.getElementById('chartTemp_div'));
        var chartViento = new google.visualization.Gauge(document.getElementById('chartViento_div'));
        var chartHum = new google.visualization.Gauge(document.getElementById('chartHum_div'));

        
        chartTemp.draw(dataTemp, optionsTemp);
        chartViento.draw(dataHum, optionsHum);
        chartHum.draw(dataViento, optionsViento);

        setInterval(function() {
          dataTemp.setValue(0, 1, 32);
          chartTemp.draw(dataTemp, optionsTemp);
        }, 500);
        
        setInterval(function() {
          dataViento.setValue(0, 1, 55);
          chartViento.draw(dataViento, optionsViento);
        }, 500);
        
        setInterval(function() {
          dataHum.setValue(0, 1, 68);
          chartHum.draw(dataHum, optionsHum);
        }, 500);
      }
