const int PIN_TRIG = 14;
const int PIN_ECHO = 3;

void setup() {
  Serial.begin(115200);
  delay(1000);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
}

void loop() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  unsigned long t = pulseIn(PIN_ECHO, HIGH, 30000);

  Serial.print("Distancia: ");
  if (t == 0) Serial.println("sem eco");
  else { Serial.print(t * 0.0343 / 2.0); Serial.println(" cm"); }
  delay(500);
}
