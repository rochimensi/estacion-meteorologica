         function setDigitalSensorPage(){
       
                $("#main").load("digitalSensor.html");
           
          }

           function setSetupPage(){
            $.ajax("setup.html", function(data){
                $("#main").html(data);
            });
          }
                 
            

