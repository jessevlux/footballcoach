"use client";

import { useState } from "react";
import { useData, DataProvider } from "../components/DataContext";

function GoalProjectorContent() {
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [showShot, setShowShot] = useState(false);
  const [shotPosition, setShotPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { addShot } = useData();

  // Convert grid index to x,y coordinates (center of the zone)
  const getZoneCenter = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return {
      x: col * 0.25 + 0.125, // Center of zone horizontally (0-1)
      y: row * 0.33 + 0.165, // Center of zone vertically (0-1)
    };
  };

  const generateShot = () => {
    if (targetIndex === null) return;

    // Get target zone center
    const target = getZoneCenter(targetIndex);

    // Increase randomness (up to 60% of a zone size away from target)
    const randomOffset = () => (Math.random() - 0.5) * 0.3;
    const shotX = Math.max(0, Math.min(1, target.x + randomOffset()));
    const shotY = Math.max(0, Math.min(1, target.y + randomOffset()));

    setShotPosition({ x: shotX, y: shotY });
    setShowShot(true);

    // Calculate which zone the shot landed in
    const zoneX = Math.floor(shotX * 4);
    const zoneY = Math.floor(shotY * 3);
    const actualIndex = zoneY * 4 + zoneX;

    // Calculate accuracy based on distance from target center
    const distance = Math.sqrt(
      Math.pow(shotX - target.x, 2) + Math.pow(shotY - target.y, 2)
    );
    const accuracy = distance < 0.15 ? "Good" : "Poor"; // Increased threshold for "Good" shots

    // Generate shot data
    const shot = {
      timestamp: new Date(),
      targetIndex,
      actualIndex,
      speed: Math.floor(Math.random() * 40) + 60,
      accuracy,
    };

    addShot(shot);

    // Reset shot visualization after a delay
    setTimeout(() => {
      setShowShot(false);
      setShotPosition(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-zinc-900 p-8">
      <div className="w-[80vw] h-[80vh] bg-[url('/goal1.svg')] bg-contain bg-no-repeat bg-center relative">
        {/* Grid overlay */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-4 grid-rows-3 gap-4 mt-10 h-[75%] w-[80%] mx-auto">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className={`h-full w-full ${
                  index === targetIndex ? "bg-blue-500/80" : "bg-transparent"
                } `}
              />
            ))}
          </div>
        </div>

        {/* Shot marker */}
        {showShot && shotPosition && (
          <div
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${shotPosition.x * 80 + 10}%`,
              top: `${shotPosition.y * 75 + 12.5}%`,
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-75" />
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
            {/* Inner dot for better visibility */}
            <div className="absolute inset-[25%] bg-red-600 rounded-full" />
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={() => {
              setTargetIndex(Math.floor(Math.random() * 12));
              setShowShot(false);
              setShotPosition(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Change Target
          </button>
          <button
            onClick={generateShot}
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={targetIndex === null}
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
      <GoalProjectorContent />
    </DataProvider>
  );
}
