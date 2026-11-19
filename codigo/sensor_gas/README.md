Esta pasta contém o código e os testes do sensor de gás MQ-2.

const int PIN_MQ2 = 2;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_MQ2, ADC_11db);
}

void loop() {
  Serial.print("Gas (bruto): ");
  Serial.println(analogRead(PIN_MQ2));
  delay(500);
}

