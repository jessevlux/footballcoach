"use client";

import { useState, useEffect } from "react";
import { useData } from "./DataContext";
import { useTheme } from "./ThemeContext";

type Challenge = {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  participants: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  accuracy: string;
  shots: number;
};

export default function CommunityTab({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const { shots } = useData();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<"leaderboard" | "challenges">(
    "leaderboard"
  );
  const [totalScore, setTotalScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState("N/A");

  // Sample data for challenges
  const challenges: Challenge[] = [
    {
      id: "c1",
      title: "Bullseye Master",
      description: "Score 5 bullseyes in a row",
      targetScore: 50,
      participants: 124,
      difficulty: "Hard",
    },
    {
      id: "c2",
      title: "Corner Specialist",
      description: "Hit all 4 corners of the goal",
      targetScore: 20,
      participants: 256,
      difficulty: "Medium",
    },
    {
      id: "c3",
      title: "Speed Demon",
      description: "Score 10 points with shots over 80 km/h",
      targetScore: 10,
      participants: 189,
      difficulty: "Easy",
    },
  ];

  // Sample data for leaderboard
  const leaderboard: LeaderboardEntry[] = [
    { id: "u1", name: "Alex", score: 156, accuracy: "Excellent", shots: 42 },
    { id: "u2", name: "Sam", score: 142, accuracy: "Good", shots: 51 },
    { id: "u3", name: "Jordan", score: 138, accuracy: "Excellent", shots: 38 },
    { id: "u4", name: "Taylor", score: 125, accuracy: "Good", shots: 45 },
    { id: "u5", name: "Casey", score: 118, accuracy: "Fair", shots: 62 },
  ];

  // Calculate user stats
  useEffect(() => {
    if (shots.length > 0) {
      const score = shots.reduce(
        (total, shot) => total + ((shot as any).points || 0),
        0
      );
      setTotalScore(score);
      setTotalShots(shots.length);

      // Calculate average accuracy
      const accuracyMap: Record<string, number> = {
        Bullseye: 4,
        Excellent: 3,
        Good: 2,
        Fair: 1,
        Poor: 0,
      };

      const accuracySum = shots.reduce(
        (sum, shot) => sum + (accuracyMap[shot.accuracy] || 0),
        0
      );
      const avgAccuracyValue = accuracySum / shots.length;

      let accuracyLabel = "Poor";
      if (avgAccuracyValue > 3.5) accuracyLabel = "Bullseye";
      else if (avgAccuracyValue > 2.5) accuracyLabel = "Excellent";
      else if (avgAccuracyValue > 1.5) accuracyLabel = "Good";
      else if (avgAccuracyValue > 0.5) accuracyLabel = "Fair";

      setAverageAccuracy(accuracyLabel);
    }
  }, [shots]);

  const textColor = darkMode || !isMobile ? "text-white" : "text-gray-800";
  const bgColor = darkMode || !isMobile ? "bg-zinc-800" : "bg-white";
  const bgColorDarker = darkMode || !isMobile ? "bg-zinc-700" : "bg-gray-100";
  const borderColor =
    darkMode || !isMobile ? "border-zinc-700" : "border-gray-200";

  return (
    <div
      className={`${
        isMobile
          ? "p-4 overflow-y-auto max-h-[550px] no-scrollbar"
          : "min-h-screen p-8"
      } ${darkMode || !isMobile ? "bg-zinc-900" : "bg-gray-50"} ${textColor}`}
    >
      <div className={`${isMobile ? "" : "max-w-6xl mx-auto"}`}>
        {!isMobile && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Soccer Training Community</h1>
            <a
              href="/goalprojector"
              className="px-4 py-2 bg-blue-500 rounded text-white"
            >
              Back to Training
            </a>
          </div>
        )}

        {/* User Stats Card */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-xl font-bold mb-3">Your Stats</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className={`${bgColorDarker} p-3 rounded-lg text-center`}>
              <p className="text-sm">Score</p>
              <p className="text-xl font-bold text-yellow-400">{totalScore}</p>
            </div>
            <div className={`${bgColorDarker} p-3 rounded-lg text-center`}>
              <p className="text-sm">Shots</p>
              <p className="text-xl font-bold text-blue-400">{totalShots}</p>
            </div>
            <div className={`${bgColorDarker} p-3 rounded-lg text-center`}>
              <p className="text-sm">Accuracy</p>
              <p className="text-xl font-bold text-green-400">
                {averageAccuracy}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${borderColor} mb-4`}>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "leaderboard"
                ? "border-b-2 border-blue-500 text-blue-500"
                : darkMode || !isMobile
                ? "text-zinc-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "challenges"
                ? "border-b-2 border-blue-500 text-blue-500"
                : darkMode || !isMobile
                ? "text-zinc-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("challenges")}
          >
            Challenges
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "leaderboard" && (
          <div className={`${bgColor} rounded-lg overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={bgColorDarker}>
                    <th className="px-3 py-2 text-left text-sm">#</th>
                    <th className="px-3 py-2 text-left text-sm">Player</th>
                    <th className="px-3 py-2 text-left text-sm">Score</th>
                    <th className="px-3 py-2 text-left text-sm">Acc.</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id} className={`border-t ${borderColor}`}>
                      <td className="px-3 py-2 text-sm">{index + 1}</td>
                      <td className="px-3 py-2 text-sm">{entry.name}</td>
                      <td className="px-3 py-2 text-sm">{entry.score}</td>
                      <td className="px-3 py-2 text-sm">{entry.accuracy}</td>
                    </tr>
                  ))}
                  <tr
                    className={`border-t ${borderColor} ${
                      darkMode || !isMobile ? "bg-zinc-600" : "bg-blue-50"
                    }`}
                  >
                    <td className="px-3 py-2 text-sm">
                      {leaderboard.length + 1}
                    </td>
                    <td className="px-3 py-2 text-sm font-medium">You</td>
                    <td className="px-3 py-2 text-sm">{totalScore}</td>
                    <td className="px-3 py-2 text-sm">{averageAccuracy}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`${bgColor} rounded-lg overflow-hidden shadow-sm`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold">{challenge.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        challenge.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-400"
                          : challenge.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      darkMode || !isMobile ? "text-zinc-400" : "text-gray-500"
                    } mb-3`}
                  >
                    {challenge.description}
                  </p>
                  <div className="flex justify-between text-xs text-zinc-400 mb-3">
                    <span>Target: {challenge.targetScore} pts</span>
                    <span>{challenge.participants} participants</span>
                  </div>
                  <button className="w-full py-1.5 bg-blue-500 rounded text-sm font-medium text-white">
                    Join Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
