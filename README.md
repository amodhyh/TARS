# Smart School Bus Tracking & Attendance System 🚌📱

A comprehensive solution for real-time school bus tracking and automated student attendance using RFID technology, GPS tracking, and Firebase integration.


## Key Features ✨
- **Real-time GPS Tracking** - Live bus location updates every 10 seconds
- **RFID-based Attendance** - Automatic student check-in/check-out
- **Firebase Backend** - Secure cloud storage for all data
- **Mobile Dashboard** - React Native app for admin/parent monitoring
- **Historical Data** - Attendance records and route history
- **Emergency Alerts** - Instant notifications for route deviations

## Circuit diagram
![Wiring Diagram](https://github.com/user-attachments/assets/53aceaec-2968-482f-9ef0-428b3433af1e)

## Hardware Components 🛠️
| Component | Quantity | Purpose |
|-----------|----------|---------|
| ESP32 WROVER | 1 | Main controller |
| RFID RC522 | 1 | Student ID scanning |
| NEO-6M GPS | 1 | Location tracking |
| 18650 Battery | 2 | Power supply |
| RFID Cards | 20+ | Student identification |

## Software Stack 💻
**Backend Services**
- Firebase Realtime Database
- Firebase Authentication

**Mobile Application**
- React Native

**ESP32 Firmware**
- C 
- MFRC522 RFID Library
- TinyGPS++ Library

## System Architecture 📡
```mermaid
graph TD
    A[RFID Scanner] --> B(ESP32)
    C[GPS Module] --> B
    B --> D{Firebase Cloud}
    D --> E[Mobile App]
    E --> F[User]
```
# 🚍 Mobile App

![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

A smart bus tracker built with Expo React Native, delivering real-time transit updates, route planning, and seamless commuting.

<div align="center">
  <img src="/assets/screen1.png" width="30%" alt="Home Screen" />
  <img src="/assets/screen2.png" width="30%" alt="Map View" />
  <img src="/assets/screen3.png" width="30%" alt="Route Details" />
</div>



## 🛠 Tech Stack
| Category          | Technology                          |
|-------------------|-------------------------------------|
| Framework         | Expo React Native                   |
| Language          | JavaScript                          |
| Styling           | NativeWind (Tailwind for RN)        |
| Navigation        | React Navigation                   |
| Backend           | Firebase (Auth, Firestore, Cloud Functions) |
| Maps              | Google Maps API                    |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- Expo CLI (`npm install -g expo-cli`)
- Yarn or npm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/tars-mobile.git
cd tars-mobile
```
### Install dependencies

### Setup environment
```bash
cp .env.example .env
```
### Add your API keys in the app.json file
### Add the firebase configuration file to the config folder

### Start the development server
```bash
npx expo start
```

## 📬 Contact

**H.M.A. Yasitha Herath** : 2021/E/045 : amodhwork@gmail.com

2020/E/131 : RATHNAYAKE U.S 

2021/E/038 : NUGEGODAARACHCHI G.L 

2021/E/090 : BANDARA S.C.M 


**GitHub:** @amodhyh
