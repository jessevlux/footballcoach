"use client";

import { useState, useEffect } from "react";
import { useData, DataProvider } from "../components/DataContext";
import Link from "next/link";

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

function CommunityContent() {
  const { shots } = useData();
  const [activeTab, setActiveTab] = useState<
    "leaderboard" | "challenges" | "coaches"
  >("leaderboard");
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
    // Add current user based on shots data
  ];

  // Calculate user stats
  useEffect(() => {
    if (shots.length > 0) {
      const score = shots.reduce(
        (total, shot) => total + (shot.points || 0),
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

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Soccer Training Community</h1>
          <Link href="/goalprojector" className="px-4 py-2 bg-blue-500 rounded">
            Back to Training
          </Link>
        </div>

        {/* User Stats Card */}
        <div className="bg-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-700 p-4 rounded-lg text-center">
              <p className="text-lg">Total Score</p>
              <p className="text-3xl font-bold text-yellow-400">{totalScore}</p>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg text-center">
              <p className="text-lg">Total Shots</p>
              <p className="text-3xl font-bold text-blue-400">{totalShots}</p>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg text-center">
              <p className="text-lg">Average Accuracy</p>
              <p className="text-3xl font-bold text-green-400">
                {averageAccuracy}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-700 mb-6">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "leaderboard"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "challenges"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveTab("challenges")}
          >
            Challenges
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "coaches"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveTab("coaches")}
          >
            Find Coaches
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "leaderboard" && (
          <div className="bg-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-700">
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Player</th>
                  <th className="px-6 py-3 text-left">Score</th>
                  <th className="px-6 py-3 text-left">Accuracy</th>
                  <th className="px-6 py-3 text-left">Shots</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className="border-t border-zinc-700">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{entry.name}</td>
                    <td className="px-6 py-4">{entry.score}</td>
                    <td className="px-6 py-4">{entry.accuracy}</td>
                    <td className="px-6 py-4">{entry.shots}</td>
                  </tr>
                ))}
                <tr className="border-t border-zinc-700 bg-zinc-600">
                  <td className="px-6 py-4">{leaderboard.length + 1}</td>
                  <td className="px-6 py-4">You</td>
                  <td className="px-6 py-4">{totalScore}</td>
                  <td className="px-6 py-4">{averageAccuracy}</td>
                  <td className="px-6 py-4">{totalShots}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-zinc-800 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{challenge.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
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
                  <p className="text-zinc-400 mb-4">{challenge.description}</p>
                  <div className="flex justify-between text-sm text-zinc-400 mb-6">
                    <span>Target: {challenge.targetScore} points</span>
                    <span>{challenge.participants} participants</span>
                  </div>
                  <button className="w-full py-2 bg-blue-500 rounded font-medium">
                    Join Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "coaches" && (
          <div className="bg-zinc-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Find a Coach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-700 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <h3 className="text-xl font-bold">Coach Michael</h3>
                    <p className="text-zinc-400">
                      Professional Trainer, 8 years exp.
                    </p>
                  </div>
                </div>
                <p className="mb-4">
                  Specializes in shooting technique and accuracy training.
                </p>
                <button className="w-full py-2 bg-blue-500 rounded font-medium">
                  Request Session
                </button>
              </div>
              <div className="bg-zinc-700 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mr-4"></div>
                  <div>
                    <h3 className="text-xl font-bold">Coach Sarah</h3>
                    <p className="text-zinc-400">
                      Youth Development Specialist, 5 years exp.
                    </p>
                  </div>
                </div>
                <p className="mb-4">
                  Focuses on fundamentals and progressive skill development.
                </p>
                <button className="w-full py-2 bg-blue-500 rounded font-medium">
                  Request Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Community() {
  return (
    <DataProvider>
      <CommunityContent />
    </DataProvider>
  );
}
