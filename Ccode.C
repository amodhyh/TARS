#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>

#define HIGH 1
#define LOW 0
#define OUTPUT 1

#define SS_PIN 5           // Slave select pin for RFID
#define RST_PIN 22         // Reset pin for RFID
#define BUZZER_PIN 4       // Buzzer output pin

// WiFi and Firebase configuration constants
#define WIFI_SSID "My"
#define WIFI_PASSWORD "GIMA2510"
#define API_KEY "AIzaSyBchtiXRq1QjEiFWzPp6TvG-anv9FS9CSo"
#define DATABASE_URL "https://tars-90cbb-default-rtdb.asia-southeast1.firebasedatabase.app/"

const long gmtOffset_sec = 5 * 3600 + 30 * 60;  // GMT offset in seconds
const int daylightOffset_sec = 0;              // No daylight saving offset

char uidString[64];      // String to store RFID UID
bool newRFID = false;    // Flag to indicate new RFID detection

// Mock functions to simulate embedded behavior
void pinMode(int pin, int mode) {
    // Set the pin mode
}

void digitalWrite(int pin, int value) {
    // Write HIGH or LOW to pin
}

void Serial_begin(int baud) {
    // Initialize serial communication
    printf("Serial initialized at %d baud\n", baud);
}

void Serial_print(const char* msg) {
    printf("%s", msg);
}

void Serial_println(const char* msg) {
    printf("%s\n", msg);
}

void delay(int ms) {
    // Simulate a delay
}

bool connectWiFi(const char* ssid, const char* password) {
    // Simulate WiFi connection
    printf("Connecting to WiFi: %s\n", ssid);
    return true;
}

bool initializeRFID() {
    // Simulate RFID initialization
    return true;
}

bool readRFID(char* buffer) {
    // Simulate RFID detection
    strcpy(buffer, "ABC123DEF456");
    return true;
}

bool gpsIsValid() {
    // Simulate GPS lock
    return true;
}

void getGPSData(char* lat, char* lon) {
    // Simulate getting GPS data
    strcpy(lat, "7.2906");
    strcpy(lon, "80.6337");
}

bool firebaseSendJSON(const char* path, const char* json) {
    // Simulate sending data to Firebase
    printf("Firebase Path: %s\nData: %s\n", path, json);
    return true;
}

bool getLocalTimeNow(struct tm* timeinfo) {
    time_t now = time(NULL);
    now += gmtOffset_sec;
    *timeinfo = *localtime(&now);
    return true;
}

// Setup function to initialize peripherals
void setup() {
    Serial_begin(115200);
    delay(1000);

    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);

    initializeRFID();
    Serial_println("RFID reader initialized");

    if (connectWiFi(WIFI_SSID, WIFI_PASSWORD)) {
        Serial_println("WiFi connected.");
    }

    struct tm timeinfo;
    if (getLocalTimeNow(&timeinfo)) {
        char buffer[64];
        strftime(buffer, sizeof(buffer), "Initial time: %Y-%m-%d %H:%M:%S", &timeinfo);
        Serial_println(buffer);
    } else {
        Serial_println("Failed to obtain time");
    }
}

// Main loop function
void loop() {
    struct tm timeinfo;

    if (readRFID(uidString)) {
        Serial_print("RFID Detected: ");
        Serial_println(uidString);

        digitalWrite(BUZZER_PIN, HIGH);
        delay(200);
        digitalWrite(BUZZER_PIN, LOW);

        newRFID = true;
    }

    if (newRFID) {
        if (getLocalTimeNow(&timeinfo)) {
            char dateBuffer[11];
            char timeBuffer[9];
            char dateTimeKey[20];

            // Format date
            snprintf(dateBuffer, sizeof(dateBuffer), "%04d-%02d-%02d",
                     timeinfo.tm_year + 1900,
                     timeinfo.tm_mon + 1,
                     timeinfo.tm_mday);

            // Format time
            snprintf(timeBuffer, sizeof(timeBuffer), "%02d:%02d:%02d",
                     timeinfo.tm_hour,
                     timeinfo.tm_min,
                     timeinfo.tm_sec);

            // Create unique timestamp key
            snprintf(dateTimeKey, sizeof(dateTimeKey), "%04d%02d%02d_%02d%02d%02d",
                     timeinfo.tm_year + 1900,
                     timeinfo.tm_mon + 1,
                     timeinfo.tm_mday,
                     timeinfo.tm_hour,
                     timeinfo.tm_min,
                     timeinfo.tm_sec);

            Serial_print("Current Date: ");
            Serial_println(dateBuffer);
            Serial_print("Current Time: ");
            Serial_println(timeBuffer);
            Serial_print("Using Firebase key: ");
            Serial_println(dateTimeKey);

            // Get GPS coordinates
            char latitude[32], longitude[32];
            if (gpsIsValid()) {
                getGPSData(latitude, longitude);
            } else {
                strcpy(latitude, "No Signal");
                strcpy(longitude, "No Signal");
            }

            // Create JSON strings
            char json1[256];
            snprintf(json1, sizeof(json1),
                     "{\"uid\":\"%s\",\"date\":\"%s\",\"time\":\"%s\"}",
                     uidString, dateBuffer, timeBuffer);

            char json2[256];
            snprintf(json2, sizeof(json2),
                     "{\"latitude\":\"%s\",\"longitude\":\"%s\"}",
                     latitude, longitude);

            // Firebase paths
            char gpsPath[] = "/Busses/busesInfo/bus001/currentLocation/";
            firebaseSendJSON(gpsPath, json2);

            char dataPath[128];
            snprintf(dataPath, sizeof(dataPath),
                     "/Busses/attendanceHistory/%s_%s",
                     uidString, dateTimeKey);

            if (firebaseSendJSON(dataPath, json1)) {
                Serial_println("Data sent to Firebase successfully!");
            } else {
                Serial_println("Firebase error");
            }
        }
        newRFID = false;
    }
}

// Entry point
int main() {
    setup();
    while (1) {
        loop();
        delay(1000);
    }
    return 0;
}