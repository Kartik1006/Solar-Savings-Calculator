# 🌞 Solar Savings Calculator

## 📌 Project Overview
The **Solar Savings Calculator** is a web application designed to help users estimate solar panel requirements, cost savings, and return on investment (ROI) based on their location, roof size, and energy consumption.

The app integrates **geolocation services** and **solar irradiance data** to provide precise calculations and recommendations.

It is built using **React (with Hooks), Framer Motion (for animations), and Express.js (for backend API calls)**.

---
## 🚀 Features
### ✅ User Inputs:
- Location (**Auto-fetch coordinates via API**)
- Roof Area (sq.m)
- Monthly Electricity Bill (₹)

### ✅ API Integrations:
- **Geolocation API** (Fetches latitude & longitude from user address)
- **Solar Irradiance API** (Fetches direct normal irradiance for solar calculations)
- **Backend API (Express.js)** (Processes calculations for costs, ROI, energy savings, etc.)

### ✅ Smart Validations:
- Prevents invalid inputs
- Auto-fetch coordinates based on user address

### ✅ Animated UI with Framer Motion:
- **Smooth form transitions**
- **Button interactions**
- **Result section fades in dynamically**

### ✅ Solar Energy Output Calculation:
- Estimated **Total Cost** of solar setup
- Expected **ROI (Years)**
- **Annual Savings** in electricity bills
- **Net Present Value** of investment
- **Energy Production (kWh/year)**
- Recommended **Panel Power Capacity (kW)**
- Suggested **Roof Area Usage (sq.m)**
- Pros & Cons list

---
## 🏗️ Tech Stack
### **Frontend**
- **React.js (Hooks, useState)**
- **Framer Motion** (for animations)
- **CSS (Custom styling & responsive layout)**

### **Backend**
- **Node.js** (for server-side logic)
- **Express.js** (for API endpoints)
- **CORS & Body-parser** (for request handling)

### **APIs Used**
- 🌍 **Geolocation API:** Converts addresses to latitude & longitude
- ☀️ **Solar Irradiance API:** Fetches sunlight exposure data

---
## 🔧 Installation & Setup

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/solar-panel-calculator.git
cd solar-panel-calculator
```

### 2️⃣ **Install Dependencies**
```sh
npm install  # Installs frontend dependencies
cd backend && npm install  # Installs backend dependencies
```

### 3️⃣ **Run the Backend Server**
```sh
cd backend
node server.js  # Runs the Express.js server on port 3003
```

### 4️⃣ **Run the Frontend**
```sh
npm start  # Starts React app on localhost:3000
```

---
## 🎨 UI Flow
### **1️⃣ User Enters Location**
- User types address (auto-fetches coordinates)
- Input field turns green if valid ✅

### **2️⃣ User Fills Roof Size & Energy Usage**
- Must be a positive number
- Input validation ensures no incorrect values

### **3️⃣ Calculation & API Calls**
- Fetches solar irradiance
- Sends data to backend for solar calculations

### **4️⃣ Display Results**
- Animated result card appears with estimated savings, ROI, and pros & cons
- Option to **recalculate**

---
## 📡 API Endpoints
### 🌍 **Geolocation API**
```sh
GET https://geocode.maps.co/search?q=<ADDRESS>&api_key=<API_KEY>
```
- Returns: `{ lat, lon }`

### ☀️ **Solar Irradiance API**
```sh
POST http://localhost:3003/solar_irradiance
Body: { latitude, longitude }
```
- Returns: `{ dni: 5.7 } // Solar irradiance in kWh/m²/day`

### ⚡ **Solar Calculation API**
```sh
POST http://localhost:3003/calculate_solar
Body: { location, area, electricityBillAmount, latitude, longitude }
```
- Returns:
```json
{
  "cost": 120000,
  "roi": 5.2,
  "savings": 18000,
  "npv": 45000,
  "energyProduction": 4800,
  "suggestedArea": 40,
  "panelPowerCapacitykW": 3.5,
  "solarIrradianceUsed": 5.7,
  "pros": ["Long-term savings", "Eco-friendly"],
  "cons": ["Initial cost is high"]
}
```

---
## 🎭 Animations (Framer Motion)
| Component | Animation |
|-----------|-----------|
| **Form** | Fade-in & slide-up |
| **Inputs** | Slight zoom-in on focus |
| **Submit Button** | Hover effects (scale) |
| **Results Card** | Animated appearance |
| **List Items** | Sequential fade-in |

---
## 🛠️ Possible Improvements
🔹 **Dark Mode Support** 🌙  
🔹 **PWA Support** (For offline calculations) 📱  
🔹 **More Detailed Cost Analysis** 📊  
🔹 **User Authentication & Profile Saving** 🔐  

---
## 📜 License
This project is **open-source**.

---
## 🤝 Contributing
1. Fork the repo 🍴
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Added new feature'`
4. Push changes: `git push origin feature-name`
5. Submit a Pull Request 📌

