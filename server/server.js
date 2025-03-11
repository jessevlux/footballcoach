const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Sta verbinding toe van je Next.js app
    methods: ["GET", "POST"]
  }
});

// Database setup
const db = new sqlite3.Database('./sensor_data.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS kicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER,
    temperature REAL,
    imu1_accel_x REAL, imu1_accel_y REAL, imu1_accel_z REAL,
    imu1_gyro_x REAL, imu1_gyro_y REAL, imu1_gyro_z REAL,
    imu2_accel_x REAL, imu2_accel_y REAL, imu2_accel_z REAL,
    imu2_gyro_x REAL, imu2_gyro_y REAL, imu2_gyro_z REAL
  )`);
});

// Serial port setup voor ESP32
const port = new SerialPort({
  path: 'COM3', // Pas dit aan naar de juiste poort van je ESP32
  baudRate: 115200
});

// Data verwerking
let buffer = '';
port.on('data', (data) => {
  console.log(data);
  buffer += data.toString();
  if (buffer.includes('\n')) {
    const lines = buffer.split('\n');
    buffer = lines.pop();
    
    lines.forEach(line => {
      try {
        const sensorData = JSON.parse(line);
        io.emit('sensorData', sensorData);
        
        // Sla data op in database
        db.run(`INSERT INTO kicks (
          timestamp, temperature,
          imu1_accel_x, imu1_accel_y, imu1_accel_z,
          imu1_gyro_x, imu1_gyro_y, imu1_gyro_z,
          imu2_accel_x, imu2_accel_y, imu2_accel_z,
          imu2_gyro_x, imu2_gyro_y, imu2_gyro_z
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Date.now(),
          sensorData.temperature,
          sensorData.imu0.accel.x, sensorData.imu0.accel.y, sensorData.imu0.accel.z,
          sensorData.imu0.gyro.x, sensorData.imu0.gyro.y, sensorData.imu0.gyro.z,
          sensorData.imu1.accel.x, sensorData.imu1.accel.y, sensorData.imu1.accel.z,
          sensorData.imu1.gyro.x, sensorData.imu1.gyro.y, sensorData.imu1.gyro.z
        ]);
      } catch (e) {
        console.error('Error parsing data:', e);
      }
    });
  }
});

// WebSocket verbindingen
io.on('connection', (socket) => {
  console.log('Nieuwe client verbonden');
  
  // Stuur historische data
  db.all('SELECT * FROM kicks ORDER BY timestamp DESC LIMIT 10', (err, rows) => {
    if (!err) socket.emit('history', rows);
  });
});

// Start de server
server.listen(3001, () => {
  console.log('Server draait op poort 3001');
}); 