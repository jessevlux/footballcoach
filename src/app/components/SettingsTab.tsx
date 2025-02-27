"use client";
import { useTheme } from "./ThemeContext";

export default function SettingsTab() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto">
      <div className="p-4">
        <h1
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Settings
        </h1>

        <div
          className={`rounded-xl shadow p-4 ${
            darkMode ? "bg-zinc-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-medium ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              Dark Mode
            </span>
            <button
              onClick={toggleDarkMode}
              className={`${
                darkMode ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
