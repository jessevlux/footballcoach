"use client";
import { useTheme } from "../components/ThemeContext";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  return (
    <div
      className={`mx-auto w-[360px] h-[720px] ${
        darkMode ? "bg-zinc-900" : "bg-gray-50"
      } rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-black relative md:scale-100 scale-[0.85]`}
    >
      {/* Status Bar */}
      <div className="bg-zinc-900 text-white px-6 py-2 flex justify-between items-center text-sm">
        <span>9:41</span>
        <div className="w-[120px] h-[25px] bg-black absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-2xl" />
        <div className="flex gap-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Settings Content */}
      <div className="h-[calc(100%-120px)] overflow-y-auto">
        <div className="p-4">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className={`${darkMode ? "text-white" : "text-gray-800"} mr-2`}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Settings
            </h1>
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

      {/* Bottom Navigation */}
      <div
        className={`absolute bottom-0 w-full ${
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100"
        } border-t px-6 py-4 flex justify-between items-center`}
      >
        <button
          onClick={() => router.push("/")}
          className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
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
        <button className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}>
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
        <button className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}>
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
