"use client";
import { useTheme } from "./ThemeContext";

type ShotVisualizerProps = {
  targetIndex: number | null;
  showShot: boolean;
  shotPosition?: { x: number; y: number };
};

export default function ShotVisualizer({
  targetIndex,
  showShot,
  shotPosition,
}: ShotVisualizerProps) {
  const { darkMode } = useTheme();

  // Grid layout: 4x3
  const gridCells = Array.from({ length: 12 }, (_, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return { row, col, index };
  });

  return (
    <div className="relative w-full aspect-[16/9] bg-white rounded-xl overflow-hidden">
      {/* Goal net background */}
      <div className="absolute inset-0 bg-[url('/goal-net.svg')] opacity-20" />

      {/* Grid */}
      <div className="grid grid-cols-4 grid-rows-3 h-full">
        {gridCells.map(({ index }) => (
          <div
            key={index}
            className={`border border-gray-300 ${
              targetIndex === index ? "bg-blue-500/20" : ""
            }`}
          />
        ))}
      </div>

      {/* Shot marker */}
      {showShot && shotPosition && (
        <div
          className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: `${shotPosition.x * 100}%`,
            top: `${shotPosition.y * 100}%`,
          }}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-75" />
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
}
