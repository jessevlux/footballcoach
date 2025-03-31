"use client";
import { useState, useEffect } from "react";
import { useData } from "./DataContext";
import { useTheme } from "./ThemeContext";

export default function HomeTab() {
  const { shots } = useData();
  const { darkMode } = useTheme();
  const bgColor = darkMode ? "bg-zinc-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-800";

  // Recent shots data
  const recentShots = shots.slice(-3).reverse();

  // Vrienden activiteit (mock data)
  const friendActivity = [
    {
      id: 1,
      name: "Thomas",
      action: "heeft een nieuw record gevestigd",
      score: "85 km/h",
      time: "2 uur geleden",
      avatar: "🧑‍🦱",
    },
    {
      id: 2,
      name: "Julia",
      action: "heeft de Bullseye Master challenge voltooid",
      score: "",
      time: "gisteren",
      avatar: "👩",
    },
    {
      id: 3,
      name: "Kevin",
      action: "heeft 250 punten bereikt",
      score: "",
      time: "2 dagen geleden",
      avatar: "👨‍🦰",
    },
  ];

  // Upcoming trainingen
  const upcomingTrainings = [
    {
      id: 1,
      title: "Dagelijkse Schietoefening",
      time: "Vandaag",
      completed: false,
    },
    {
      id: 2,
      title: "Precisie Training",
      time: "Morgen, 15:00",
      completed: false,
    },
  ];

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar pb-16">
      <div className="p-4">
        {/* Statistieken overview */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-lg font-bold mb-3">Jouw Statistieken</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-zinc-400">Schoten</p>
              <p className="text-xl font-bold text-blue-500">{shots.length}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Totaal Punten</p>
              <p className="text-xl font-bold text-yellow-500">
                {shots.reduce((total, shot) => total + (shot.points || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Gem. snelheid</p>
              <p className="text-xl font-bold text-green-500">
                {shots.length > 0
                  ? `${Math.round(
                      shots.reduce((sum, shot) => sum + shot.speed, 0) /
                        shots.length
                    )} km/h`
                  : "0 km/h"}
              </p>
            </div>
          </div>
        </div>

        {/* Vrienden Activiteit */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-lg font-bold mb-3">Vrienden Activiteit</h2>
          <div className="space-y-3">
            {friendActivity.map((friend) => (
              <div key={friend.id} className="flex items-start">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-lg mr-2 flex-shrink-0">
                  {friend.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{friend.name}</span>{" "}
                    {friend.action}
                    {friend.score && (
                      <span className="font-semibold"> {friend.score}</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-400">{friend.time}</p>
                </div>
                <button
                  className="text-xs bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => alert(`Reactie verzonden naar ${friend.name}`)}
                >
                  👍
                </button>
              </div>
            ))}
          </div>
          <button
            className="w-full text-center text-xs text-blue-400 mt-3"
            onClick={() => alert("Meer activiteit laden...")}
          >
            Meer laden...
          </button>
        </div>

        {/* Upcoming trainingen */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-lg font-bold mb-3">Geplande Trainingen</h2>
          <div className="space-y-3">
            {upcomingTrainings.map((training) => (
              <div
                key={training.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-sm">{training.title}</p>
                  <p className="text-xs text-zinc-400">{training.time}</p>
                </div>
                <button
                  className="text-xs bg-green-500 px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => alert(`Training '${training.title}' gestart!`)}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recente Schoten (als er schoten zijn) */}
        {recentShots.length > 0 && (
          <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
            <h2 className="text-lg font-bold mb-3">Recente Schoten</h2>
            <div className="space-y-3">
              {recentShots.map((shot, index) => (
                <div
                  key={index}
                  className="border-b border-zinc-700 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        Schot {shots.length - index}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(shot.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          shot.accuracy === "Bullseye"
                            ? "text-yellow-400"
                            : shot.accuracy === "Excellent"
                            ? "text-green-400"
                            : shot.accuracy === "Good"
                            ? "text-blue-400"
                            : shot.accuracy === "Fair"
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      >
                        {shot.accuracy}
                      </p>
                      <p className="text-xs text-zinc-400">{shot.speed} km/h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
