const int SLIDER_PIN = 1; // change this each attempt

void setup() {
  Serial.begin(115200);
  while (!Serial) { delay(10); }
  analogReadResolution(12);
  Serial.println("READY");
}

void loop() {
  int raw = analogRead(SLIDER_PIN);
  Serial.println(raw);
  delay(100);
}
