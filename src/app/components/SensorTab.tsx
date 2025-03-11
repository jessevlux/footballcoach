"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import io from "socket.io-client";

type SensorData = {
  temperature: number;
  imu0: {
    accel: { x: number; y: number; z: number };
    gyro: { x: number; y: number; z: number };
  };
  imu1: {
    accel: { x: number; y: number; z: number };
    gyro: { x: number; y: number; z: number };
  };
};

export default function SensorTab() {
  const { darkMode } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("sensorData", (data: SensorData) => {
      setSensorData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Sensor Data
        </h2>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {sensorData && (
        <div
          className={`${
            darkMode ? "bg-zinc-800" : "bg-white"
          } rounded-xl p-4 shadow-lg`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3
                className={`text-sm ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Temperature
              </h3>
              <p
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {sensorData.temperature}°C
              </p>
            </div>
            <div>
              <h3
                className={`text-sm ${
                  darkMode ? "text-zinc-400" : "text-gray-500"
                }`}
              >
                Acceleration (IMU1)
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                X: {sensorData.imu0.accel.x.toFixed(2)}
                <br />
                Y: {sensorData.imu0.accel.y.toFixed(2)}
                <br />
                Z: {sensorData.imu0.accel.z.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
