"use client";
import { useData } from "../components/DataContext";
import { useTheme } from "../components/ThemeContext";
import { useState } from "react";
import SettingsTab from "../components/SettingsTab";

type Tab = "home" | "stats" | "settings";

export default function MobileApp() {
  const { shots, latestShot } = useData();
  const { darkMode } = useTheme();
  const [currentTab, setCurrentTab] = useState<Tab>("home");

  const renderContent = () => {
    switch (currentTab) {
      case "settings":
        return <SettingsTab />;
      case "stats":
        return (
          <div className={`p-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Stats page coming soon...
          </div>
        );
      default:
        return (
          <>
            {/* Latest Shot Card */}
            {latestShot && (
              <div
                className={`m-4 p-5 ${
                  darkMode ? "bg-zinc-800" : "bg-white"
                } rounded-2xl shadow-lg border ${
                  darkMode ? "border-zinc-700" : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Latest Shot
                  </h2>
                  <span
                    className={`text-xs ${
                      darkMode
                        ? "bg-blue-900/50 text-blue-200"
                        : "bg-blue-100 text-blue-800"
                    } px-2 py-1 rounded-full`}
                  >
                    {latestShot.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`${
                      darkMode ? "bg-zinc-700" : "bg-gray-50"
                    } p-3 rounded-xl`}
                  >
                    <p
                      className={`text-sm ${
                        darkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      Speed
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {latestShot.speed} km/h
                    </p>
                  </div>
                  <div
                    className={`${
                      darkMode ? "bg-zinc-700" : "bg-gray-50"
                    } p-3 rounded-xl`}
                  >
                    <p
                      className={`text-sm ${
                        darkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      Target
                    </p>
                    <div className="flex flex-col">
                      <p
                        className={`text-xl font-bold ${
                          latestShot.accuracy === "Good"
                            ? "text-green-500"
                            : "text-orange-500"
                        }`}
                      >
                        {latestShot.accuracy === "Good" ? "Hit!" : "Missed"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`${
                      darkMode ? "bg-zinc-700" : "bg-gray-50"
                    } p-3 rounded-xl`}
                  >
                    <p
                      className={`text-sm ${
                        darkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      Accuracy
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        latestShot.accuracy === "Good"
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {latestShot.accuracy}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Shot History */}
            <div className="px-4">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Shot History
                </h2>
                <span
                  className={`text-sm ${
                    darkMode ? "text-zinc-400" : "text-gray-500"
                  }`}
                >
                  {shots.length} shots
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
                {shots
                  .slice()
                  .reverse()
                  .map((shot, index) => (
                    <div
                      key={index}
                      className={`${
                        darkMode
                          ? "bg-zinc-800 border-zinc-700"
                          : "bg-white border-gray-100"
                      } p-4 rounded-xl border shadow-sm flex justify-between items-center`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              shot.accuracy === "Good"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {shot.accuracy === "Good"
                              ? "Target Hit"
                              : "Target Missed"}
                          </span>
                        </div>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-zinc-400" : "text-gray-500"
                          }`}
                        >
                          {shot.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {shot.speed} km/h
                        </p>
                        <p
                          className={`text-xs ${
                            shot.accuracy === "Good"
                              ? "text-green-500"
                              : "text-orange-500"
                          }`}
                        >
                          {shot.accuracy}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={`mx-auto w-[360px] h-[720px] ${
        darkMode ? "bg-zinc-900" : "bg-gray-50"
      } rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-black relative md:scale-[0.8] scale-[0.85] md:origin-top`}
    >
      {/* Status Bar */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-b from-black/50 to-transparent text-white font-semibold"
            : "bg-gradient-to-b from-black/30 to-transparent text-black font-semibold"
        } px-6 py-2 flex justify-between items-center text-sm`}
      >
        <span>9:41</span>
        <div className="w-[120px] h-[25px] bg-black absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-2xl" />
        <div className="flex gap-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* App Header */}
      <div className=" p-6 text-white">
        <h1 className="text-2xl text-blue-600 font-bold mb-2">
          Football Coach
        </h1>
        <p className={`${darkMode ? "text-white" : "text-black"} text-sm`}>
          Track your shooting progress
        </p>
      </div>

      {/* Main Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <div
        className={`absolute bottom-0 w-full ${
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100"
        } border-t px-6 py-4 flex justify-between items-center`}
      >
        <button
          onClick={() => setCurrentTab("home")}
          className={`${
            currentTab === "home"
              ? "text-blue-500"
              : darkMode
              ? "text-zinc-400"
              : "text-zinc-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentTab("stats")}
          className={`${
            currentTab === "stats"
              ? "text-blue-500"
              : darkMode
              ? "text-zinc-400"
              : "text-zinc-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentTab("settings")}
          className={`${
            currentTab === "settings"
              ? "text-blue-500"
              : darkMode
              ? "text-zinc-400"
              : "text-zinc-600"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
