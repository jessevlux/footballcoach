"use client";

import { useState, useEffect, useMemo } from "react";
import { useData } from "./DataContext";
import { useTheme } from "./ThemeContext";

type Challenge = {
  id: string;
  title: string;
  description: string;
  targetScore: number;
  participants: number;
  difficulty: "Easy" | "Medium" | "Hard";
  isActive: boolean;
  progress: number;
};

type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  accuracy: string;
  shots: number;
};

type Friend = {
  id: string;
  name: string;
  status: "online" | "offline" | "training";
  lastActive: string;
  level: number;
  avatar?: string;
};

type DailyTask = {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed?: boolean;
};

interface CommunityTabProps {
  isMobile?: boolean;
}

export default function CommunityTab({ isMobile = false }: CommunityTabProps) {
  const { shots } = useData();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "leaderboard" | "challenges" | "daily" | "coaches"
  >("leaderboard");
  const [totalScore, setTotalScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [averageAccuracy, setAverageAccuracy] = useState("N/A");

  // Hardcoded leaderboard met jou bovenaan
  const leaderboard = useMemo(() => {
    // Gebruik de werkelijke punten voor de speler
    const playerPoints = shots.reduce(
      (total, shot) => total + (shot.points || 0),
      0
    );

    return [
      {
        id: "you",
        name: "You",
        score: playerPoints,
        accuracy: "Bullseye",
        shots: shots.length,
      },
      {
        id: "u1",
        name: "Alex",
        score: Math.round(playerPoints * 0.9),
        accuracy: "Good",
        shots: 42,
      },
      { id: "u2", name: "Sam", score: 142, accuracy: "Good", shots: 51 },
      { id: "u3", name: "Jordan", score: 138, accuracy: "Fair", shots: 38 },
      { id: "u4", name: "Taylor", score: 125, accuracy: "Bullseye", shots: 45 },
      { id: "u5", name: "Casey", score: 118, accuracy: "Fair", shots: 62 },
    ];
  }, [shots]);

  // Challenges met werkende knoppen
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "c1",
      title: "Bullseye Master",
      description: "Score 5 bullseyes in a row",
      targetScore: 50,
      participants: 124,
      difficulty: "Hard",
      isActive: false,
      progress: 3,
    },
    {
      id: "c2",
      title: "Corner Specialist",
      description: "Hit all 4 corners of the goal",
      targetScore: 20,
      participants: 256,
      difficulty: "Medium",
      isActive: false,
      progress: 2,
    },
    {
      id: "c3",
      title: "Speed Demon",
      description: "Score 10 points with shots over 80 km/h",
      targetScore: 10,
      participants: 189,
      difficulty: "Easy",
      isActive: false,
      progress: 5,
    },
  ]);

  // Voeg deze states toe binnen de component
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "f1",
      name: "Thomas",
      status: "online",
      lastActive: "Nu",
      level: 8,
      avatar: "🧑‍🦱",
    },
    {
      id: "f2",
      name: "Julia",
      status: "training",
      lastActive: "5m geleden",
      level: 12,
      avatar: "👩",
    },
    {
      id: "f3",
      name: "Kevin",
      status: "offline",
      lastActive: "2u geleden",
      level: 5,
      avatar: "👨‍🦰",
    },
  ]);

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: "dt1",
      title: "Dagelijkse Training",
      description: "Neem 20 schoten",
      reward: 50,
      progress: Math.min(shots.length % 20, 20),
      target: 20,
      completed: shots.length >= 20,
    },
    {
      id: "dt2",
      title: "Precisie Oefening",
      description: "Scoor 5 bullseyes",
      reward: 100,
      progress: shots.filter((s) => s.accuracy === "Bullseye").length % 5,
      target: 5,
      completed: shots.filter((s) => s.accuracy === "Bullseye").length >= 5,
    },
    {
      id: "dt3",
      title: "Snelheidstraining",
      description: "Neem 3 schoten met een snelheid boven 75 km/u",
      reward: 75,
      progress: shots.filter((s) => s.speed > 75).length % 3,
      target: 3,
      completed: shots.filter((s) => s.speed > 75).length >= 3,
    },
  ]);

  const [practiceLimit, setPracticeLimit] = useState({
    total: 50,
    used: Math.min(shots.length, 50),
    remaining: Math.max(50 - shots.length, 0),
    resetsIn: "8 uur",
  });

  const [activeFriendRequest, setActiveFriendRequest] = useState("");

  const [showAccountOptions, setShowAccountOptions] = useState(false);

  // Add state for friend requests
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "Marco", avatar: "👨‍🦲" },
    { id: 2, name: "Lisa", avatar: "👩‍🦰" },
  ]);

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
        Bullseye: 3,
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
      else if (avgAccuracyValue > 2.5) accuracyLabel = "Good";
      else if (avgAccuracyValue > 1.5) accuracyLabel = "Good";
      else if (avgAccuracyValue > 0.5) accuracyLabel = "Fair";

      setAverageAccuracy(accuracyLabel);

      // Update your score in the leaderboard
      leaderboard[0].score = Math.max(350, score + 200);
      leaderboard[0].accuracy = accuracyLabel;
      leaderboard[0].shots = shots.length;
    }
  }, [shots]);

  // Join or leave a challenge
  const toggleChallenge = (challengeId: string) => {
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, isActive: !challenge.isActive }
          : challenge
      )
    );

    // Alert to show it's working
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge) {
      if (!challenge.isActive) {
        alert(`You joined the "${challenge.title}" challenge!`);
      } else {
        alert(`You left the "${challenge.title}" challenge.`);
      }
    }
  };

  const sendFriendRequest = () => {
    if (activeFriendRequest.trim()) {
      alert(`Vriendschapsverzoek verzonden naar ${activeFriendRequest}!`);
      setActiveFriendRequest("");
    } else {
      alert("Voer een gebruikersnaam of e-mail in");
    }
  };

  const claimTaskReward = (taskId: string) => {
    setDailyTasks(
      dailyTasks.map((task) =>
        task.id === taskId && task.completed && !task.claimed
          ? { ...task, claimed: true }
          : task
      )
    );

    // Update score in de leaderboard
    const task = dailyTasks.find((t) => t.id === taskId);
    if (task && task.completed && !task.claimed) {
      leaderboard[0].score += task.reward;
      alert(`Je hebt ${task.reward} punten verdiend!`);
    }
  };

  const textColor = darkMode ? "text-white" : "text-gray-800";
  const bgColor = darkMode ? "bg-zinc-800" : "bg-white";
  const bgColorDarker = darkMode ? "bg-zinc-700" : "bg-gray-100";
  const borderColor = darkMode ? "border-zinc-700" : "border-gray-200";

  // Check if we have a stored tab to switch to
  useEffect(() => {
    const storedTab = sessionStorage.getItem("communityActiveTab");
    if (storedTab) {
      setActiveTab(
        storedTab as "leaderboard" | "challenges" | "daily" | "coaches"
      );
      // Clear the stored tab to prevent it persisting across refreshes
      sessionStorage.removeItem("communityActiveTab");
    }
  }, []);

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar pb-16">
      <div className="p-4">
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

        {/* Tabs - voeg nieuwe tabs toe */}
        <div
          className={`flex border-b ${borderColor} mb-4 overflow-x-auto no-scrollbar`}
        >
          <button
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${
              activeTab === "leaderboard"
                ? "border-b-2 border-blue-500 text-blue-500"
                : darkMode
                ? "text-zinc-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Ranglijst
          </button>
          <button
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${
              activeTab === "challenges"
                ? "border-b-2 border-blue-500 text-blue-500"
                : darkMode
                ? "text-zinc-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("challenges")}
          >
            Uitdagingen
          </button>
          <button
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${
              activeTab === "daily"
                ? "border-b-2 border-blue-500 text-blue-500"
                : darkMode
                ? "text-zinc-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("daily")}
          >
            Dagelijks
          </button>
          <button
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${
              activeTab === "coaches"
                ? "border-b-2 border-blue-500 text-blue-500"
                : darkMode
                ? "text-zinc-400"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("coaches")}
          >
            Coaches
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
                  {/* Jij op nummer 1 */}
                  <tr className={`border-t ${borderColor} bg-blue-900/30`}>
                    <td className="px-3 py-2 text-sm">1</td>
                    <td className="px-3 py-2 text-sm font-bold text-yellow-400">
                      YOU (CHAMPION)
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {leaderboard[0].score}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {leaderboard[0].accuracy}
                    </td>
                  </tr>

                  {/* Andere spelers */}
                  {leaderboard.slice(1).map((entry, index) => (
                    <tr key={entry.id} className={`border-t ${borderColor}`}>
                      <td className="px-3 py-2 text-sm">{index + 2}</td>
                      <td className="px-3 py-2 text-sm">{entry.name}</td>
                      <td className="px-3 py-2 text-sm">{entry.score}</td>
                      <td className="px-3 py-2 text-sm">{entry.accuracy}</td>
                    </tr>
                  ))}
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
                      darkMode ? "text-zinc-400" : "text-gray-500"
                    } mb-3`}
                  >
                    {challenge.description}
                  </p>
                  <div className="flex justify-between text-xs text-zinc-400 mb-3">
                    <span>Target: {challenge.targetScore} pts</span>
                    <span>{challenge.participants} participants</span>
                  </div>
                  {challenge.isActive && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {challenge.progress} /{" "}
                          {challenge.id === "c1"
                            ? 5
                            : challenge.id === "c2"
                            ? 4
                            : 10}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{
                            width: `${
                              (challenge.progress /
                                (challenge.id === "c1"
                                  ? 5
                                  : challenge.id === "c2"
                                  ? 4
                                  : 10)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => toggleChallenge(challenge.id)}
                    className={`w-full py-1.5 text-xs rounded font-medium ${
                      challenge.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {challenge.isActive ? "Leave Challenge" : "Join Challenge"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "daily" && (
          <div className="space-y-4">
            <div className={`${bgColor} rounded-lg p-4 shadow-sm`}>
              <h3 className="text-sm font-bold mb-2">Training Limiet</h3>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Vrije schoten vandaag</span>
                  <span>
                    {practiceLimit.used} / {practiceLimit.total}
                  </span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{
                      width: `${
                        (practiceLimit.used / practiceLimit.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-zinc-400">
                Je kunt nog {practiceLimit.remaining} schoten nemen. Limiet
                reset over {practiceLimit.resetsIn}.
                <button
                  className="ml-2 text-blue-400 underline"
                  onClick={() =>
                    alert("Premium is nodig om extra schoten te kopen")
                  }
                >
                  Koop Extra
                </button>
              </p>
            </div>

            <div className={`${bgColor} rounded-lg shadow-sm`}>
              <div className="flex justify-between items-center p-4 pb-2">
                <h3 className="text-sm font-bold">Dagelijkse Taken</h3>
                <span className="text-xs text-zinc-400">Reset in 8 uur</span>
              </div>
              <div className="divide-y divide-zinc-700">
                {dailyTasks.map((task) => (
                  <div key={task.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-semibold">{task.title}</h4>
                        <p className="text-xs text-zinc-400">
                          {task.description}
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        +{task.reward} pts
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Voortgang</span>
                        <span>
                          {task.progress} / {task.target}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            task.completed ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (task.progress / task.target) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() => claimTaskReward(task.id)}
                      className={`w-full py-1.5 text-xs rounded font-medium ${
                        task.completed
                          ? task.claimed
                            ? "bg-green-500/50 text-green-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                          : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                      }`}
                      disabled={!task.completed || task.claimed}
                    >
                      {task.completed
                        ? task.claimed
                          ? "Beloning Ontvangen"
                          : "Claim Beloning"
                        : "Voltooi de Taak"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "coaches" && (
          <div className="space-y-4">
            <div className={`${bgColor} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Coach Michael
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Professional Trainer, 8 years exp.
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 mb-3">
                Specializes in shooting technique and accuracy training.
              </p>
              <button
                onClick={() => alert("Session request sent to Coach Michael!")}
                className="w-full py-1.5 text-xs bg-blue-500 rounded font-medium hover:bg-blue-600"
              >
                Request Session
              </button>
            </div>

            <div className={`${bgColor} rounded-lg p-4`}>
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Coach Sarah
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Youth Development Specialist, 5 years exp.
                  </p>
                </div>
              </div>
              <p className="text-xs text-zinc-300 mb-3">
                Focuses on fundamentals and progressive skill development.
              </p>
              <button
                onClick={() => alert("Session request sent to Coach Sarah!")}
                className="w-full py-1.5 text-xs bg-blue-500 rounded font-medium hover:bg-blue-600"
              >
                Request Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
