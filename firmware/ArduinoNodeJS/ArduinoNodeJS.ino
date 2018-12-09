d/////////////////////////////
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
float vientoA = 0;
float vientoB = 49.4;
float vientoC = 0.23;

// Humedad vars
const int humedadPin = A3;
int humedadValue = 0;
int humedadPrev = 0;
float humedadA = 0;
float humedadB = 1.5;
float humedadC = -24;

// Temperatura vars
const int tempPin = A4;
int tempValue = 0;
int tempPrev = 0;
float temperaturaA = 0;
float temperaturaB = 0.044;
float temperaturaC = 0;

// Botones vars
const int gabinete = 2;
int gabineteState = 1;
int gabineteStatePrev = 1;

const int suministroElectrico = 3;
int suministroState = 1;
int suministroStatePrev = 1;
boolean hayCorte = false;

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
  pinMode(gabinete,INPUT);
  pinMode(suministroElectrico,INPUT);
}

void loop() {
  //Suministro eléctrico
    suministroState = digitalRead(suministroElectrico);
    if(suministroState != suministroStatePrev) {
      if(!suministroState) {
        Serial.print("SUMIN0");
        Serial.print(delimiter);
        hayCorte = true;
      } else {
        Serial.print("SUMIN1");
        Serial.print(delimiter);
        hayCorte = false;
      }
      suministroStatePrev = suministroState;
    }

  if(!hayCorte) {
    if (stringComplete) {
      decodificar_comandos();
      inputString = "";
      stringComplete = false;
    }

    // Apertura del gabinete
    gabineteState = digitalRead(gabinete);
    if(gabineteState != gabineteStatePrev) {
      if(!gabineteState) {
        Serial.print("GABI0");
        Serial.print(delimiter);
      } else {
        Serial.print("GABI1");
        Serial.print(delimiter);
      }
      gabineteStatePrev = gabineteState;
    }

    // Viento
    vientoValue = analogRead(vientoPin);
    if(vientoPrev != vientoValue){
      // V(m/s) = 49,4 ∗ U(V) + 0,23, Nx = Vx / Resolucion = Vx / 0.005V
      float viento = vientoA * vientoValue * vientoValue + vientoB * vientoValue * 0.005 + vientoC;
      Serial.print("V");
      Serial.print(viento);
      Serial.print(delimiter);
      vientoPrev = vientoValue;
    }

    // Humedad
    humedadValue = analogRead(humedadPin);
    if(humedadPrev != humedadValue){
      // Humedad = 1.5 * Nx - 24
      float humedad = humedadA * humedadValue * humedadValue + humedadB * humedadValue + humedadC;
      Serial.print("H");
      Serial.print(humedad);
      Serial.print(delimiter);
      humedadPrev = humedadValue;
    }

    // Temperatura
    tempValue = analogRead(tempPin);
    if(tempPrev != tempValue){
      float temperatura = temperaturaA * tempValue * tempValue + temperaturaB * tempValue + temperaturaC;
      Serial.print("T");
      Serial.print(temperatura);
      Serial.print(delimiter);
      tempPrev = tempValue;
    }

    delay(delaySegundos*1000);
  }
}

void serialEvent() {
  if(!hayCorte) {
    while (Serial.available()) {
      char inChar = (char)Serial.read();
      inputString += inChar;
      if (inChar == '\n') {
        stringComplete = true;
      }
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
    float temperatura = temperaturaA * analogRead(4) * analogRead(4) + temperaturaB * analogRead(4) + temperaturaC;
    float viento = vientoA * analogRead(2) * analogRead(2) + vientoB * analogRead(2) * 0.005 + vientoC;
    float humedad = humedadA * analogRead(3) * analogRead(3) + humedadB * analogRead(3) + humedadC;
    Serial.print("SCAN");
    Serial.print(viento);
    Serial.print(";");
    Serial.print(humedad);
    Serial.print(";");
    Serial.print(temperatura);
    Serial.print(delimiter);
  }

  else if(inputString.substring(0,4)=="TIME") { // TIME(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    delaySegundos = valor.toInt();
  }

  else if(inputString.substring(0,4)=="HUMA") { // HUMA(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    humedadA = valor.toFloat();
  }

  else if(inputString.substring(0,4)=="HUMB") { // HUMB(valor)
      int indexClose = inputString.indexOf(")");
      String valor = inputString.substring(5,indexClose);
      humedadB = valor.toFloat();
    }

  else if(inputString.substring(0,4)=="HUMC") { // HUMC(valor)
      int indexClose = inputString.indexOf(")");
      String valor = inputString.substring(5,indexClose);
      humedadC = valor.toFloat();
    }

  else if(inputString.substring(0,4)=="TEMA") { // TEMA(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    temperaturaA = valor.toFloat();
  }

  else if(inputString.substring(0,4)=="TEMB") { // TEMB(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    temperaturaB = valor.toFloat();
  }

  else if(inputString.substring(0,4)=="TEMC") { // TEMC(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    temperaturaC = valor.toFloat();
  }

  else if(inputString.substring(0,4)=="VIEA") { // VIEA(valor)
      int indexClose = inputString.indexOf(")");
      String valor = inputString.substring(5,indexClose);
      vientoA = valor.toFloat();
    }

  else if(inputString.substring(0,4)=="VIEB") { // VIEB(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    vientoB = valor.toFloat();
  }

  else if(inputString.substring(0,4)=="VIEC") { // VIEC(valor)
    int indexClose = inputString.indexOf(")");
    String valor = inputString.substring(5,indexClose);
    vientoC = valor.toFloat();
  }
}