#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C *lcd;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Wire.begin(6, 7);   

  // procura o endereço do LCD
  byte endereco = 0;
  for (byte a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) {
      endereco = a;
      break;
    }
  }

  if (endereco == 0) {
    Serial.println("LCD nao encontrado. Verifica SDA, SCL, GND e VCC.");
    while (true) delay(1000);
  }

  Serial.print("LCD encontrado em 0x");
  Serial.println(endereco, HEX);

  lcd = new LiquidCrystal_I2C(endereco, 16, 2);
  lcd->init();
  lcd->backlight();
  lcd->setCursor(0, 0);
  lcd->print("CLI a funcionar");
  lcd->setCursor(0, 1);
  lcd->print("Ola, mundo!");
}

void loop() {}
