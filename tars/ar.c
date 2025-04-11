#include <Arduino.h>
#include <MFRC522.h>
#include <SPI.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <time.h>               // For NTP and getLocalTime()
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>

// RFID Settings (update pins per your wiring)
#define SS_PIN 5                // SPI Slave Select (SDA)
#define RST_PIN 22              // Reset pin
MFRC522 mfrc522(SS_PIN, RST_PIN);

// WiFi & Firebase Settings
#define WIFI_SSID "My"
#define WIFI_PASSWORD "GIMA2510"
#define API_KEY "AIzaSyBchtiXRq1QjEiFWzPp6TvG-anv9FS9CSo"
#define DATABASE_URL "https://tars-90cbb-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

TinyGPSPlus gps;
HardwareSerial GPSserial(1); // Use UART1 for GPS (RX, TX)

const long gmtOffset_sec = 5 * 3600 + 30 * 60; // 5 hours and 30 minutes in seconds
const int daylightOffset_sec = 0;              // No daylight saving time in Sri Lanka

// Global variables
String uidString = "";
bool newRFID = false;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Initialize SPI & RFID module
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("RFID reader initialized");

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected. IP: " + WiFi.localIP().toString());

  // Initialize time with NTP
  configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org");
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time from NTP");
  } else {
    Serial.print("Initial time from NTP: ");
    Serial.println(&timeinfo, "%Y-%m-%d %H:%M:%S");
  }

  // Configure Firebase
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = "nugegodaarachchigimanthi2001@gmail.com";
  auth.user.password = "ESP32@";
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Initialize GPS Serial (baud rate typically 9600 for Neo-6M)
  GPSserial.begin(9600, SERIAL_8N1, 16, 17); // RX, TX pins
}

void loop() {
  // Read RFID tag if present
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    uidString = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      if (mfrc522.uid.uidByte[i] < 0x10)
        uidString += "0";  // for two-digit representation
      uidString += String(mfrc522.uid.uidByte[i], HEX);
    }
    uidString.toUpperCase();
    Serial.println("RFID Detected: " + uidString);
    newRFID = true;
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }
  
  // Read GPS data
  while (GPSserial.available() > 0) {
    gps.encode(GPSserial.read());
  }

  // If a new RFID is detected and Firebase is ready:
  if (newRFID && Firebase.ready()) {
    struct tm timeinfo;
    // Allow up to 5 sec to get local time via NTP/RTC
    if (!getLocalTime(&timeinfo, 5000)) {
      Serial.println("Failed to get local time.");
    } else {
      // Create formatted date and time strings
      char dateBuffer[11]; // "YYYY-MM-DD"
      char timeBuffer[9];  // "HH:MM:SS"
      snprintf(dateBuffer, sizeof(dateBuffer), "%04d-%02d-%02d",
               timeinfo.tm_year + 1900,
               timeinfo.tm_mon + 1,
               timeinfo.tm_mday);
      snprintf(timeBuffer, sizeof(timeBuffer), "%02d:%02d:%02d",
               timeinfo.tm_hour,
               timeinfo.tm_min,
               timeinfo.tm_sec);
      
      // Create a key for Firebase using a combined date & time string (safe for Firebase paths)
      char dateTimeKey[20]; // e.g. "20250410_120355"
      snprintf(dateTimeKey, sizeof(dateTimeKey),
               "%04d%02d%02d_%02d%02d%02d",
               timeinfo.tm_year + 1900,
               timeinfo.tm_mon + 1,
               timeinfo.tm_mday,
               timeinfo.tm_hour,
               timeinfo.tm_min,
               timeinfo.tm_sec);
      
      Serial.print("Current Date: ");
      Serial.println(dateBuffer);
      Serial.print("Current Time: ");
      Serial.println(timeBuffer);
      Serial.print("Using Firebase key: ");
      Serial.println(dateTimeKey);

      // Prepare GPS data strings
      String latitude = gps.location.isValid() ? String(gps.location.lat(), 6) : "No Signal";
      String longitude = gps.location.isValid() ? String(gps.location.lng(), 6) : "No Signal";

      // Prepare Firebase JSON payload
      FirebaseJson json;
      json.set("uid", uidString);
      json.set("date", dateBuffer);
      json.set("time", timeBuffer);
     
      FirebaseJson json2;
      json2.set("latitude", latitude);
      json2.set("longitude",longitude);
      //gps path
      String path_gps="/Busses/busesInfo/bus001/currentLocation/";
      Firebase.RTDB.setJSON(&fbdo, path_gps.c_str(), &json2);

      // Use the formatted dateTimeKey as your unique path:
      String path = "/Busses/attendanceHistory/" + String(uidString) + "_" + String(dateTimeKey);
      if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
        Serial.println("Data sent to Firebase successfully!");
      } else {
        Serial.print("Firebase error: ");
        Serial.println(fbdo.errorReason());
      }
    }
    // Reset flag after processing RFID
    newRFID = false;
  }
}