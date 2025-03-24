"use client";
import { useTheme } from "./ThemeContext";

interface SettingsTabProps {
  onClose: () => void;
}

export default function SettingsTab({ onClose }: SettingsTabProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Settings
          </h1>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              darkMode ? "text-white bg-zinc-700" : "text-gray-700 bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

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
