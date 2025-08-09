#ifndef CONFIG_H
#define CONFIG_H

// ====================
// Configuration Header
// ====================

// ==== WiFi Config ====
// Replace with your own WiFi credentials
#define WIFI_SSID         "YOUR_WIFI_SSID"
#define WIFI_PASSWORD     "YOUR_WIFI_PASSWORD"

// ==== WebSocket Config ====
// Replace with your WebSocket server info
#define WS_HOST           "192.168.x.x"
#define WS_PORT           3000
#define WS_PATH           "/?device=lights"

// ==== Servo ====
// Adjust pins and positions if needed
#define SERVO_PIN         D1
#define SERVO_POS_INITIAL 0
#define SERVO_POS_ACTIVE  90

#endif // CONFIG_H
