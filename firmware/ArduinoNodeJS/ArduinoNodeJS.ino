// LED vars 
const int ledPin = 13;

// LED read vars
String inputString = "";         // a string to hold incoming data
boolean toggleComplete = false;  // whether the string is complete

// Viento vars
const int vientoPin = A2;
int vientoValue = 0;
int vientoPrev = 0;

// Humedad vars
const int humedadPin = A3;
int humedadValue = 0;
int humedadPrev = 0;

// Temperatura vars
const int tempPin = A4;
int tempValue = 0;
int tempPrev = 0;

void setup() {
  // initialize serial:
  Serial.begin(9600);
  // init LEDS
  pinMode(ledPin,OUTPUT);
  digitalWrite(ledPin,0);
}

void loop() {
   // Recieve data from Node and write it to a String
   while (Serial.available() && toggleComplete == false) {
    char inChar = (char)Serial.read();
    if(inChar == 'E'){ // end character for led
     toggleComplete = true;
    }
    else{
      inputString += inChar; 
    }
  }
  // Toggle LED 13
  if(!Serial.available() && toggleComplete == true)
  {
    // convert String to int. 
    int recievedVal = stringToInt();
    
    if(recievedVal == 0)
    {
      digitalWrite(ledPin,recievedVal);
    }
    else if(recievedVal == 1)
    {
      digitalWrite(ledPin,recievedVal);
    }    
    toggleComplete = false;
  }

// Viento
  vientoValue = analogRead(vientoPin);   
  if(vientoPrev != vientoValue){
    Serial.print("V");
    Serial.print(vientoValue);
    Serial.print("/");
    vientoPrev = vientoValue;
  }  

  // Humedad
  humedadValue = analogRead(humedadPin);   
  if(humedadPrev != humedadValue){
    Serial.print("H");
    Serial.print(humedadValue);
    Serial.print("/");
    humedadPrev = humedadValue;
  }  

  // Temperatura
  tempValue = analogRead(tempPin);   
  if(tempPrev != tempValue){
    Serial.print("T");
    Serial.print(tempValue);
    Serial.print("/");
    tempPrev = tempValue;
  }  
  delay(1000);
}

int stringToInt()
{
    char charHolder[inputString.length()+1];
    inputString.toCharArray(charHolder,inputString.length()+1);
    inputString = "";
    int _recievedVal = atoi(charHolder);
    return _recievedVal;
}
