"use client";
import { useData } from "../components/DataContext";
import { useTheme } from "../components/ThemeContext";
import { useState, useRef, useEffect } from "react";
import SettingsTab from "../components/SettingsTab";
import SensorTab from "../components/SensorTab";
import CommunityTab from "../components/CommunityTab";
import FootballTab from "../components/FootballTab";
import FriendsTab from "../components/FriendsTab";

type Tab = "home" | "stats" | "sensor" | "football" | "friends";

export default function MobileApp() {
  const { shots, latestShot } = useData();
  const { darkMode } = useTheme();
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [showSettings, setShowSettings] = useState(false);

  const renderContent = () => {
    switch (currentTab) {
      case "stats":
        return <CommunityTab isMobile={true} />;
      case "sensor":
        return <SensorTab />;
      case "football":
        return <FootballTab />;
      case "friends":
        return <FriendsTab />;
      default:
        return <HomeContent setCurrentTab={setCurrentTab} />;
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
      <div className="p-6 text-white flex justify-between items-center">
        {currentTab === "home" ? (
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-bold">Football Coach</h1>
            <button
              onClick={() => setShowSettings(true)}
              className="text-zinc-400"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        ) : currentTab === "friends" ? (
          <div className="flex justify-between w-full items-center">
            <h1 className="text-xl font-bold">Chats</h1>
            <button
              className="p-2 bg-zinc-800 rounded-full"
              onClick={() => {
                const event = new CustomEvent("toggleFriendsPanel");
                window.dispatchEvent(event);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </button>
          </div>
        ) : (
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {currentTab === "football" && "Training"}
            {currentTab === "stats" && "Community"}
            {currentTab === "sensor" && "Sensor"}
          </h1>
        )}
      </div>

      {/* Main Content */}
      {showSettings ? (
        <SettingsTab onClose={() => setShowSettings(false)} />
      ) : (
        renderContent()
      )}

      {/* Bottom Navigation */}
      <div
        className={`absolute bottom-0 w-full ${
          darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100"
        } border-t px-6 py-4 flex justify-between items-center`}
      >
        <button
          onClick={() => {
            setCurrentTab("home");
            setShowSettings(false);
          }}
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
          onClick={() => {
            setCurrentTab("football");
            setShowSettings(false);
          }}
          className={`${
            currentTab === "football"
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
              d="M12 4.5v15m7.5-7.5h-15"
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
          onClick={() => setCurrentTab("friends")}
          className={`${
            currentTab === "friends"
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function enableHorizontalDrag() {
  useEffect(() => {
    const scrollContainers = document.querySelectorAll(".overflow-x-auto");

    scrollContainers.forEach((container) => {
      let isDown = false;
      let startX: number = 0;
      let scrollLeft: number = 0;

      container.addEventListener("mousedown", (e: Event) => {
        const mouseEvent = e as MouseEvent;
        isDown = true;
        container.classList.add("active");
        startX = mouseEvent.pageX - (container as HTMLElement).offsetLeft;
        scrollLeft = (container as HTMLElement).scrollLeft;
      });

      container.addEventListener("mouseleave", () => {
        isDown = false;
        container.classList.remove("active");
      });

      container.addEventListener("mouseup", () => {
        isDown = false;
        container.classList.remove("active");
      });

      container.addEventListener("mousemove", (e: Event) => {
        const mouseEvent = e as MouseEvent;
        if (!isDown) return;
        mouseEvent.preventDefault();
        const x = mouseEvent.pageX - (container as HTMLElement).offsetLeft;
        const walk = (x - startX) * 2;
        (container as HTMLElement).scrollLeft = scrollLeft - walk;
      });

      // Touch events voor mobiel
      container.addEventListener("touchstart", (e: Event) => {
        const touchEvent = e as TouchEvent;
        isDown = true;
        startX =
          touchEvent.touches[0].pageX - (container as HTMLElement).offsetLeft;
        scrollLeft = (container as HTMLElement).scrollLeft;
      });

      container.addEventListener("touchend", () => {
        isDown = false;
      });

      container.addEventListener("touchmove", (e: Event) => {
        const touchEvent = e as TouchEvent;
        if (!isDown) return;
        const x =
          touchEvent.touches[0].pageX - (container as HTMLElement).offsetLeft;
        const walk = (x - startX) * 2;
        (container as HTMLElement).scrollLeft = scrollLeft - walk;
      });
    });
  }, []);

  return null;
}

function HomeContent({ setCurrentTab }: { setCurrentTab: (tab: Tab) => void }) {
  const { shots, latestShot } = useData();
  const { darkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  // Voeg deze state toe voor vriendverzoeken
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "Marco", avatar: "👨‍🦲" },
    { id: 2, name: "Lisa", avatar: "👩‍🦰" },
  ]);

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar p-4 pb-20">
      {/* Persoonlijke statistieken dashboard */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <h2 className="text-sm font-bold mb-3">Jouw Statistieken</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-zinc-700 rounded-lg p-3 text-center">
            <p className="text-xs text-zinc-400">Trainingen</p>
            <p className="text-xl font-bold">24</p>
          </div>
          <div className="bg-zinc-700 rounded-lg p-3 text-center">
            <p className="text-xs text-zinc-400">Gem. Snelheid</p>
            <p className="text-xl font-bold">
              76<span className="text-xs">km/u</span>
            </p>
          </div>
          <div className="bg-zinc-700 rounded-lg p-3 text-center">
            <p className="text-xs text-zinc-400">Precisie</p>
            <p className="text-xl font-bold">
              82<span className="text-xs">%</span>
            </p>
          </div>
        </div>
        <button
          className="w-full text-center text-xs text-blue-400"
          onClick={() => setCurrentTab("stats")}
        >
          Bekijk alle statistieken
        </button>
      </div>

      {/* Aanbevolen trainingen */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <h2 className="text-sm font-bold mb-3">Aanbevolen Trainingen</h2>
        <div className="space-y-3">
          <div className="bg-zinc-700 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Precisie Training</p>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                15 min
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              Verbeter je schietnauwkeurigheid met deze gerichte oefeningen
            </p>
            <button
              className="w-full bg-blue-500 py-1.5 rounded text-xs font-medium"
              onClick={() => setCurrentTab("football")}
            >
              Start Training
            </button>
          </div>
          <div className="bg-zinc-700 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Kracht Training</p>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                20 min
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              Verhoog je schietkracht met deze progressieve oefeningen
            </p>
            <button
              className="w-full bg-blue-500 py-1.5 rounded text-xs font-medium"
              onClick={() => setCurrentTab("football")}
            >
              Start Training
            </button>
          </div>
        </div>
      </div>

      {/* Voortgang en prestaties */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <h2 className="text-sm font-bold mb-3">Jouw Voortgang</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs">Wekelijkse Trainingen</p>
              <p className="text-xs font-medium">3/5</p>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs">Maandelijks Doel</p>
              <p className="text-xs font-medium">68%</p>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs">Precisie Verbetering</p>
              <p className="text-xs font-medium">+12%</p>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dagelijkse tips */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <h2 className="text-sm font-bold mb-2">Dagelijkse Tip</h2>
        <div className="bg-zinc-700 rounded-lg p-3">
          <p className="text-sm italic mb-2">
            "Focus op je standvoet positie om je schietnauwkeurigheid te
            verbeteren. Plaats je standvoet naast de bal, niet erachter."
          </p>
          <p className="text-xs text-right text-zinc-400">- Coach Michael</p>
        </div>
      </div>

      {/* Vriendverzoeken sectie */}
      {friendRequests.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-bold mb-3">Vriendverzoeken</h2>
          <div className="space-y-3">
            {friendRequests.map((friend) => (
              <div key={friend.id} className="flex items-center">
                <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-xl mr-3">
                  {friend.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{friend.name}</p>
                  <p className="text-xs text-zinc-400">Wil je vriend worden</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-1.5 bg-green-500 rounded"
                    onClick={() => {
                      alert(`Je hebt ${friend.name}'s verzoek geaccepteerd!`);
                      setFriendRequests(
                        friendRequests.filter((req) => req.id !== friend.id)
                      );
                    }}
                  >
                    ✓
                  </button>
                  <button
                    className="p-1.5 bg-red-500 rounded"
                    onClick={() => {
                      alert(`Je hebt ${friend.name}'s verzoek afgewezen`);
                      setFriendRequests(
                        friendRequests.filter((req) => req.id !== friend.id)
                      );
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dagelijkse Challenge */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <h2 className="text-sm font-bold mb-3">Dagelijkse Challenge</h2>
        <div>
          <div className="mb-3">
            <p className="text-sm font-medium">Precisie Master</p>
            <p className="text-xs text-zinc-400 mb-2">
              Scoor 5 bullseyes in één training
            </p>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
            <p className="text-xs text-right mt-1 text-zinc-400">
              2/5 voltooid
            </p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-xs font-medium w-full"
            onClick={() => setCurrentTab("football")}
          >
            Challenge voltooien
          </button>
        </div>
      </div>

      {/* Vrienden activiteit sectie */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
        <h2 className="text-sm font-bold mb-3">Vrienden Activiteit</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-lg mr-2">
              👨‍🦰
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">Kevin</span> heeft een nieuw
                record: 82 km/u
              </p>
              <p className="text-xs text-zinc-400">30 min geleden</p>
            </div>
            <button
              className="text-xs bg-blue-500 px-2 py-1 rounded"
              onClick={() => alert("Reactie verzonden naar Kevin")}
            >
              👍
            </button>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-lg mr-2">
              👩
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">Julia</span> heeft een challenge
                voltooid
              </p>
              <p className="text-xs text-zinc-400">2 uur geleden</p>
            </div>
            <button
              className="text-xs bg-blue-500 px-2 py-1 rounded"
              onClick={() => alert("Reactie verzonden naar Julia")}
            >
              👍
            </button>
          </div>
        </div>
        <button className="w-full text-center text-xs text-blue-400 mt-3">
          Meer laden...
        </button>
      </div>

      {/* Settings overlay */}
      {showSettings && <SettingsTab onClose={() => setShowSettings(false)} />}

      {/* Voeg de enableHorizontalDrag toe */}
      {enableHorizontalDrag()}
    </div>
  );
}
