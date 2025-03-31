"use client";
import { useTheme } from "./ThemeContext";
import { useState } from "react";

interface SettingsTabProps {
  onClose: () => void;
}

export default function SettingsTab({ onClose }: SettingsTabProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState<
    "general" | "account" | "notifications" | "privacy"
  >("general");

  const [notificationSettings, setNotificationSettings] = useState({
    trainingReminders: true,
    friendActivity: true,
    challengeUpdates: true,
    coachMessages: true,
    appUpdates: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    shareActivity: true,
    allowFriendRequests: true,
    shareStats: true,
  });

  const toggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  const togglePrivacy = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });
  };

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar pb-16">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Instellingen
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

        {/* Section tabs */}
        <div className="flex border-b border-zinc-700 mb-4 overflow-x-auto no-scrollbar">
          <button
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === "general"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveSection("general")}
          >
            Algemeen
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === "account"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveSection("account")}
          >
            Account
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === "notifications"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveSection("notifications")}
          >
            Meldingen
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
              activeSection === "privacy"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-zinc-400"
            }`}
            onClick={() => setActiveSection("privacy")}
          >
            Privacy
          </button>
        </div>

        {/* General settings */}
        {activeSection === "general" && (
          <div className="space-y-4">
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
                  Donkere Modus
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

            <div
              className={`rounded-xl shadow p-4 ${
                darkMode ? "bg-zinc-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  Taal
                </span>
                <select className="bg-zinc-700 text-white text-sm rounded px-2 py-1">
                  <option value="nl">Nederlands</option>
                  <option value="en">Engels</option>
                  <option value="de">Duits</option>
                  <option value="fr">Frans</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  Maateenheid
                </span>
                <select className="bg-zinc-700 text-white text-sm rounded px-2 py-1">
                  <option value="metric">Metrisch (km/u)</option>
                  <option value="imperial">Imperiaal (mph)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Account settings */}
        {activeSection === "account" && (
          <div className="space-y-4">
            <div
              className={`rounded-xl shadow p-4 ${
                darkMode ? "bg-zinc-800" : "bg-white"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold">Jouw Naam</h3>
                  <p className="text-sm text-zinc-400">user@example.com</p>
                  <button
                    className="text-xs text-blue-400 mt-1"
                    onClick={() => alert("Profielfoto wijzigen")}
                  >
                    Profielfoto wijzigen
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Naam
                  </label>
                  <input
                    type="text"
                    defaultValue="Jouw Naam"
                    className="w-full bg-zinc-700 rounded px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="w-full bg-zinc-700 rounded px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Bio
                  </label>
                  <textarea
                    defaultValue="Voetballer in training..."
                    className="w-full bg-zinc-700 rounded px-3 py-1.5 text-sm"
                    rows={3}
                  />
                </div>

                <button
                  className="w-full py-2 bg-blue-500 rounded font-medium text-sm"
                  onClick={() => alert("Profiel bijgewerkt!")}
                >
                  Profiel Opslaan
                </button>
              </div>
            </div>

            <div
              className={`rounded-xl shadow p-4 ${
                darkMode ? "bg-zinc-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold mb-3">Account Beheer</h3>

              <div className="space-y-2">
                <button
                  className="w-full py-2 bg-zinc-700 rounded font-medium text-sm text-left px-3"
                  onClick={() => alert("Wachtwoord wijzigen")}
                >
                  Wachtwoord wijzigen
                </button>

                <button
                  className="w-full py-2 bg-zinc-700 rounded font-medium text-sm text-left px-3"
                  onClick={() => alert("Premium abonnement bekijken")}
                >
                  Upgrade naar Premium
                </button>

                <button
                  className="w-full py-2 bg-red-900/30 text-red-400 rounded font-medium text-sm text-left px-3"
                  onClick={() => alert("Account verwijderen?")}
                >
                  Account verwijderen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification settings */}
        {activeSection === "notifications" && (
          <div
            className={`rounded-xl shadow p-4 ${
              darkMode ? "bg-zinc-800" : "bg-white"
            }`}
          >
            <h3 className="font-semibold mb-3">Meldingen</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Training herinneringen</span>
                <button
                  onClick={() => toggleNotification("trainingReminders")}
                  className={`${
                    notificationSettings.trainingReminders
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notificationSettings.trainingReminders
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Vrienden activiteit</span>
                <button
                  onClick={() => toggleNotification("friendActivity")}
                  className={`${
                    notificationSettings.friendActivity
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notificationSettings.friendActivity
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Challenge updates</span>
                <button
                  onClick={() => toggleNotification("challengeUpdates")}
                  className={`${
                    notificationSettings.challengeUpdates
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notificationSettings.challengeUpdates
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Coach berichten</span>
                <button
                  onClick={() => toggleNotification("coachMessages")}
                  className={`${
                    notificationSettings.coachMessages
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notificationSettings.coachMessages
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">App updates</span>
                <button
                  onClick={() => toggleNotification("appUpdates")}
                  className={`${
                    notificationSettings.appUpdates
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      notificationSettings.appUpdates
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy settings */}
        {activeSection === "privacy" && (
          <div
            className={`rounded-xl shadow p-4 ${
              darkMode ? "bg-zinc-800" : "bg-white"
            }`}
          >
            <h3 className="font-semibold mb-3">Privacy-instellingen</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Toon online status</span>
                <button
                  onClick={() => togglePrivacy("showOnlineStatus")}
                  className={`${
                    privacySettings.showOnlineStatus
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      privacySettings.showOnlineStatus
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Deel activiteiten met vrienden</span>
                <button
                  onClick={() => togglePrivacy("shareActivity")}
                  className={`${
                    privacySettings.shareActivity
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      privacySettings.shareActivity
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Sta vriendschapsverzoeken toe</span>
                <button
                  onClick={() => togglePrivacy("allowFriendRequests")}
                  className={`${
                    privacySettings.allowFriendRequests
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      privacySettings.allowFriendRequests
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Deel statistieken op leaderboard
                </span>
                <button
                  onClick={() => togglePrivacy("shareStats")}
                  className={`${
                    privacySettings.shareStats ? "bg-blue-600" : "bg-gray-600"
                  } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
                >
                  <span
                    className={`${
                      privacySettings.shareStats
                        ? "translate-x-5"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-700">
                <button
                  className="text-sm text-blue-400"
                  onClick={() => alert("Data geëxporteerd")}
                >
                  Exporteer mijn gegevens
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
