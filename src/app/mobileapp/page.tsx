"use client";
import { useData } from "../components/DataContext";

export default function MobileApp() {
  const { shots, latestShot } = useData();

  return (
    <div className="w-[360px] h-[720px] bg-gray-50 rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-gray-900 relative">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-6 py-2 flex justify-between items-center text-sm">
        <span>9:41</span>
        <div className="w-[120px] h-[25px] bg-black absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-2xl" />
        <div className="flex gap-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Football Coach</h1>
        <p className="text-blue-100 text-sm">Track your shooting progress</p>
      </div>

      {/* Latest Shot Card */}
      {latestShot && (
        <div className="m-4 p-5 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Latest Shot</h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {latestShot.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-sm text-gray-500">Speed</p>
              <p className="text-xl font-bold text-gray-800">
                {latestShot.speed} km/h
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-sm text-gray-500">Target</p>
              <p className="text-xl font-bold text-gray-800">
                Zone {latestShot.targetIndex + 1}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-sm text-gray-500">Accuracy</p>
              <p
                className={`text-xl font-bold ${
                  latestShot.accuracy === "Good"
                    ? "text-green-600"
                    : "text-orange-600"
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
          <h2 className="text-lg font-semibold text-gray-800">Shot History</h2>
          <span className="text-sm text-gray-500">{shots.length} shots</span>
        </div>

        <div className="space-y-3 overflow-auto max-h-[350px] pr-2">
          {shots
            .slice()
            .reverse()
            .map((shot, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"
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
                    <span className="text-sm font-medium text-gray-800">
                      Zone {shot.targetIndex + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {shot.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {shot.speed} km/h
                  </p>
                  <p
                    className={`text-xs ${
                      shot.accuracy === "Good"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {shot.accuracy}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center">
        <button className="text-blue-600">
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
        <button className="text-blue-600">
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
        <button className="text-blue-600">
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
