"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import io from "socket.io-client";

type ImuData = {
  accel: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
};

type SensorFrame = {
  time_step: number;
  temperature: number;
  imu0: ImuData;
  imu1: ImuData;
};

export type SensorContextType = {
  connected: boolean;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  sensorData: {
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      alpha: number;
      beta: number;
      gamma: number;
    };
  };
  calibrating: boolean;
  startCalibration: () => void;
  cancelCalibration: () => void;
  latestFrame: SensorFrame | null;
  frames: SensorFrame[];
  isConnected: boolean;
};

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export function SensorProvider({ children }: { children: ReactNode }) {
  const [latestFrame, setLatestFrame] = useState<SensorFrame | null>(null);
  const [frames, setFrames] = useState<SensorFrame[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Verbind met de WebSocket server
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("sensorData", (data: SensorFrame) => {
      setLatestFrame(data);
      setFrames((prev) => [data, ...prev].slice(0, 50)); // Bewaar max 50 frames
    });

    socket.on("history", (data: SensorFrame[]) => {
      setFrames(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SensorContext.Provider value={{ latestFrame, frames, isConnected }}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensorData() {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error("useSensorData must be used within a SensorProvider");
  }
  return context;
}
