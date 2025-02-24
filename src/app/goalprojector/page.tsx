"use client";

import { useState } from "react";
import { useData, DataProvider } from "../components/DataContext";

function GoalProjectorContent() {
  const [randomIndex, setRandomIndex] = useState<number | null>(null);
  const { addShot } = useData();

  const generateShot = () => {
    const targetIndex = Math.floor(Math.random() * 12);
    setRandomIndex(targetIndex);

    // Generate fake shot data
    const shot = {
      timestamp: new Date(),
      targetIndex,
      speed: Math.floor(Math.random() * 40) + 60, // Random speed between 60-100 km/h
      accuracy: Math.random() > 0.5 ? "Good" : "Poor",
    };

    addShot(shot);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-[80vw] h-[80vh] bg-[url('/goal1.svg')] bg-contain bg-no-repeat bg-center">
        <div className="grid grid-cols-4 grid-rows-3 gap-4 mt-10 h-[75%] w-[80%] mx-auto">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={`h-full w-full ${
                index === randomIndex ? "bg-green-600" : "bg-transparent"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={() => {
              setRandomIndex(Math.floor(Math.random() * 12));
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Change Target
          </button>
          <button
            onClick={generateShot}
            className="p-2 bg-green-500 text-white rounded"
          >
            Generate Shot
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoalProjector() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-zinc-900">
        <GoalProjectorContent />
      </div>
    </DataProvider>
  );
}
