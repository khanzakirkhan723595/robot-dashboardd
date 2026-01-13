# Robot Health Monitor - Real-Time IoT Dashboard

A full-stack MERN application designed to monitor, visualize, and alert on telemetry data from a fleet of robots. This system features a real-time dashboard, a dedicated backend API, and a custom Hardware-in-the-Loop (HIL) Emulator to simulate robot behaviors and faults.

## Features
- Real-Time Monitoring: Live tracking of Battery, CPU Usage, Temperature, and Signal Strength.
- Multi-Robot Support: Fleet management capability (switch between Optimiser Prime, Hot Rod, etc.).
- Intelligent Alerting: Automated critical alerts for overheating (>60°C) and low battery (<20%).
- Interactive Visualization: Dynamic charts using Recharts to show performance trends over the last 24 hours.
- Robot Emulator: A Node.js-based simulation engine that generates realistic sensor data and edge-case faults (e.g., connection loss).

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (Time-series data for readings & alerts)
- **Simulation:** Node.js (Custom Robot Emulator)

## Project Structure
	robot-dashboardd-main/
	├── backend/            # Express REST API & Database Models
	├── frontend/           # React + Vite Dashboard
	└── robot_emulator/     # Script to simulate robot sensor data

## Installation & Run Instructions

Prerequisites:
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)

1. Setup Backend
The backend handles data ingestion and serves API endpoints.
	```
	cd backend
	npm install
	# Ensure MongoDB is running locally or configure .env
	npm start
	# Server runs on http://localhost:8000
	```

2. Setup Frontend
The dashboard visualizes the data.
	```
	cd frontend
	npm install
	npm run dev
	# Dashboard runs on http://localhost:5173
	```

3. Start the Robot Emulator
To see data appear on the dashboard, you need to generate it.
	```
	cd robot_emulator
	npm install
	node robot_emulator.js
	# You should see console logs: "Sent data for RBT-001..."
	```

## API Endpoints
- **POST /api/robot/ingest** Receives sensor data from robots/emulator.
- **GET /api/robot/latest/:robotId** Fetches the latest status for a specific robot.
- **GET /api/robot/history/:robotId** Retrieves historical data for charts.
- **GET /api/robot/alerts** Returns a list of recent critical alerts.
