#include <ESP8266WiFi.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include <Servo.h>
#include "config.h"

using namespace websockets;

// ==== Objects ====
WebsocketsClient client;
Servo myServo;

// ==== Message Handler ====
void onMessageCallback(WebsocketsMessage message) {
  String msg = message.data();
  Serial.print("Message: ");
  Serial.println(msg);

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, msg);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  const char* event = doc["param0"];
  Serial.print("Event : ");
  Serial.println(event);

  if (strcmp(event, "on") == 0) {
    Serial.println("Turning servo ON");
    myServo.write(SERVO_POS_ACTIVE);
  } 
  else if (strcmp(event, "off") == 0) {
    Serial.println("Turning servo OFF");
    myServo.write(SERVO_POS_INITIAL);
  }
}

// ==== Events Handler ====
void onEventsCallback(WebsocketsEvent event, String data) {
  if (event == WebsocketsEvent::ConnectionOpened) {
    Serial.println("WebSocket Connected!");
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    Serial.println("WebSocket Disconnected!");
  } else if (event == WebsocketsEvent::GotPing) {
    Serial.println("Ping!");
  } else if (event == WebsocketsEvent::GotPong) {
    Serial.println("Pong!");
  }
}

void setup() {
  Serial.begin(115200);

  // Servo attach to pin D1, change if needed
  myServo.attach(SERVO_PIN, 500, 2400);
  myServo.write(SERVO_POS_INITIAL);

  // Connect WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.printf("Connecting to %s\n", WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Setup WebSocket
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  Serial.println("Connecting to WebSocket...");
  client.connect(WS_HOST, WS_PORT, WS_PATH);
}


void loop() {
  if (client.available()) {
    client.poll();
  } else {
    // Auto-reconnect if disconnected
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("Reconnecting WebSocket...");
      client.connect(WS_HOST, WS_PORT, WS_PATH);
    }
    delay(1000);
  }
}
