/////////////////////////////
// Declaracion de Variables
/////////////////////////////

int dato, num_sal_dig, num_ent_dig, valor_dig;
int num_can, pin6, pin9, inicio, final, n;
int botonEstado, boton2Estado, boton3Estado;
char can, estado;
char AI[0], DO[0], DI[1];

const char* delimiter = "/";
int delaySegundos = 1;

// Control por Comandos vars
String inputString = "";
boolean stringComplete = false;

// Viento vars
const int vientoPin = A2;
int vientoValue = 0;
int vientoPrev = 0;
float vientoA = 49.4;
float vientoB = 0.23;

// Humedad vars
const int humedadPin = A3;
int humedadValue = 0;
int humedadPrev = 0;

// Temperatura vars
const int tempPin = A4;
int tempValue = 0;
int tempPrev = 0;

// Botones vars
const int gabinete = 2;
const int suministroElectrico = 3;

//////////////////////////////

void setup() {
  // init Serial:
  Serial.begin(9600);

  // init LEDS
  pinMode(6,OUTPUT);
  pinMode(9,OUTPUT);
  digitalWrite(6, 0);
  digitalWrite(9, 0);

  // init buttons
  pinMode(2,INPUT);
  pinMode(3,INPUT);
}

void loop() {
  if (stringComplete) {
    decodificar_comandos();
    inputString = "";
    stringComplete = false;
  }

  // Viento
  vientoValue = analogRead(vientoPin);
  if(vientoPrev != vientoValue){
    // Funcion de Transferencia: V(m/s) = 49,4 ∗ U(V) + 0,23
    int velocidad = vientoA * vientoValue + vientoB;
    Serial.print("V");
    Serial.print(velocidad);
    Serial.print(delimiter);
    vientoPrev = vientoValue;
  }

  // Humedad
  humedadValue = analogRead(humedadPin);
  if(humedadPrev != humedadValue){
    Serial.print("H");
    Serial.print(humedadValue);
    Serial.print(delimiter);
    humedadPrev = humedadValue;
  }

  // Temperatura
  tempValue = analogRead(tempPin);
  if(tempPrev != tempValue){
    Serial.print("T");
    Serial.print(tempValue);
    Serial.print(delimiter);
    tempPrev = tempValue;
  }

  delay(delaySegundos*1000);
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

void decodificar_comandos() {
  if(inputString.substring(0,4) == "IDEN") { // Comprueba si el cable esta sano, si la placa esta conectada, si esta en el puerto COM que corresponde, etc
    Serial.print("IDEN");
    Serial.print("Arquitectura Avanzada");
    Serial.print(delimiter);
  }

  else if (inputString.substring(0,4)=="RDAS") { // RDAS(canal)
    AI[0]=inputString.charAt(5);
    num_can=atoi(AI); // ascii to int
    dato=analogRead(num_can);
    Serial.print("Canal ");
    Serial.print(num_can);
    Serial.print("=");
    Serial.println(dato);
  }

  else if(inputString.substring(0,4)=="WRDO") { // WRDO(pin,estado)
    DO[0]=inputString.charAt(5);
    num_sal_dig = atoi(DO); // Que pin elijo para la salida digital
    DO[0]=inputString.charAt(7);
    valor_dig=atoi(DO);
    digitalWrite(num_sal_dig,valor_dig);
  }

  else if(inputString.substring(0,4)=="RDDI") { // RDDI(pin)
    DI[0]=inputString.charAt(5);
    num_ent_dig = atoi(DI);
    valor_dig=digitalRead(num_ent_dig);

    botonEstado = digitalRead(num_ent_dig);
    Serial.print("Entrada Pin ");
    Serial.print(num_ent_dig);
    Serial.print("=");
    Serial.println(valor_dig);
    if(num_ent_dig==2) {
      if(botonEstado == HIGH){
        Serial.println("Gabinete abierto");
      } else {
        Serial.println("Gabinete cerrado");
      }
    }
    if(num_ent_dig==3) {
      if(botonEstado == HIGH){
        Serial.println("Suministro Electrico cortado");
      } else {
        Serial.println("Suministro Electrico continuo");
      }
    }
  }

  else if(inputString.substring(0,4)=="SCAN") { // SCAN(Inicio,Final)
    //val1= inputString.substring(4,6).toInt();
    DI[0]= inputString.charAt(5);
    inicio=atoi(DI);
    DI[0]=inputString.charAt(7);
    final=atoi(DI);
    Serial.print("SCAN");
    for(num_can=inicio;num_can<=final;num_can++)
    {
      dato = analogRead(num_can);
      Serial.print(dato);
      if(num_can < final){
        Serial.print(";");
      }
    }
    Serial.print(delimiter);
  }

  else if(inputString.substring(0,4)=="TIME") { // TIME(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    delaySegundos = valor.toInt();

    Serial.println(delaySegundos);
  }
}