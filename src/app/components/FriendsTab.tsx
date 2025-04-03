"use client";
import { useTheme } from "./ThemeContext";
import { useState, useEffect } from "react";

export default function FriendsTab() {
  const { darkMode } = useTheme();
  const [showFriendsPanel, setShowFriendsPanel] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);

  // Luister naar het custom event om de vriendenpaneel te tonen/verbergen
  useEffect(() => {
    const handleToggleFriendsPanel = () => {
      setShowFriendsPanel(!showFriendsPanel);
    };

    window.addEventListener("toggleFriendsPanel", handleToggleFriendsPanel);

    return () => {
      window.removeEventListener(
        "toggleFriendsPanel",
        handleToggleFriendsPanel
      );
    };
  }, [showFriendsPanel]);

  // Mock data voor vrienden
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Thomas",
      avatar: "🧑‍🦱",
      status: "online",
      level: 12,
      lastActive: "1 uur geleden",
      lastMessage: "Heb je de nieuwe training al geprobeerd?",
      unread: 2,
    },
    {
      id: 2,
      name: "Julia",
      avatar: "👩",
      status: "training",
      level: 15,
      lastActive: "3 uur geleden",
      lastMessage: "Goed gedaan met die challenge!",
      unread: 0,
    },
    {
      id: 3,
      name: "Kevin",
      avatar: "👨‍🦰",
      status: "offline",
      level: 9,
      lastActive: "1 dag geleden",
      lastMessage: "Wanneer gaan we weer trainen?",
      unread: 0,
    },
    {
      id: 4,
      name: "Sophie",
      avatar: "👱‍♀️",
      status: "online",
      level: 14,
      lastActive: "2 uur geleden",
      lastMessage: "Check mijn nieuwe record!",
      unread: 1,
    },
  ]);

  // Mock data voor groepchats
  const [groupChats, setGroupChats] = useState([
    {
      id: 101,
      name: "Team Alpha",
      avatar: "⚽️",
      members: ["Thomas", "Julia", "Kevin", "Jij"],
      lastMessage: "Coach: Training verplaatst naar 18:00",
      unread: 5,
      lastActive: "30 min geleden",
    },
    {
      id: 102,
      name: "Voetbal Vrienden",
      avatar: "🏆",
      members: ["Sophie", "Marco", "Lisa", "Jij"],
      lastMessage: "Sophie: Wie gaat er mee naar de wedstrijd?",
      unread: 0,
      lastActive: "2 uur geleden",
    },
  ]);

  // Mock data voor vriendverzoeken
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "Marco", avatar: "👨‍🦲" },
    { id: 2, name: "Lisa", avatar: "👩‍🦰" },
  ]);

  // Mock data voor vriendenactiviteit
  const [friendActivity, setFriendActivity] = useState([
    {
      id: 1,
      name: "Kevin",
      avatar: "👨‍🦰",
      activity: "heeft een nieuw record: 82 km/u",
      time: "30 min geleden",
    },
    {
      id: 2,
      name: "Julia",
      avatar: "👩",
      activity: "heeft een challenge voltooid",
      time: "2 uur geleden",
    },
    {
      id: 3,
      name: "Thomas",
      avatar: "🧑‍🦱",
      activity: "is begonnen met een nieuwe training",
      time: "3 uur geleden",
    },
  ]);

  // Alle chats (persoonlijk + groep) gesorteerd op laatste activiteit
  const allChats = [
    ...friends.map((f) => ({
      id: f.id,
      name: f.name,
      avatar: f.avatar,
      lastMessage: f.lastMessage,
      unread: f.unread,
      lastActive: f.lastActive,
      isGroup: false,
      status: f.status,
    })),
    ...groupChats.map((g) => ({
      id: g.id,
      name: g.name,
      avatar: g.avatar,
      lastMessage: g.lastMessage,
      unread: g.unread,
      lastActive: g.lastActive,
      isGroup: true,
      members: g.members,
    })),
  ].sort((a, b) => {
    // Sorteer op ongelezen berichten en dan op laatste activiteit
    if (a.unread > 0 && b.unread === 0) return -1;
    if (a.unread === 0 && b.unread > 0) return 1;
    return 0; // In een echte app zou je hier op timestamp sorteren
  });

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar pb-20 relative">
      {/* Zoekbalk */}
      <div className="px-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Zoek in chats..."
            className="w-full bg-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chat lijst */}
      <div className="px-4">
        {allChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 rounded-lg mb-2 ${
              chat.unread > 0 ? "bg-zinc-800" : "bg-zinc-900"
            } ${activeChat === chat.id ? "border border-blue-500" : ""}`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center text-xl">
                {chat.avatar}
              </div>
              {!chat.isGroup && "status" in chat && (
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-800 ${
                    chat.status === "online"
                      ? "bg-green-500"
                      : chat.status === "training"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              )}
              {chat.isGroup && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-zinc-700 rounded-full flex items-center justify-center text-xs border-2 border-zinc-800">
                  👥
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">{chat.name}</p>
                <p className="text-xs text-zinc-400">{chat.lastActive}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-400 truncate max-w-[200px]">
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
              {chat.isGroup && "members" in chat && (
                <p className="text-xs text-zinc-500 mt-1">
                  {chat.members.join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Vrienden panel overlay */}
      {showFriendsPanel && (
        <div className="fixed inset-0 bg-black/80 z-20 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Vrienden</h2>
              <button
                onClick={() => setShowFriendsPanel(false)}
                className="p-2 bg-zinc-800 rounded-full"
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

            {/* Tabs voor vriendenpaneel */}
            <div className="flex border-b border-zinc-700 mb-4">
              <button className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-500">
                Vrienden
              </button>
              <button className="px-4 py-2 text-sm font-medium text-zinc-400">
                Verzoeken ({friendRequests.length})
              </button>
              <button className="px-4 py-2 text-sm font-medium text-zinc-400">
                Activiteit
              </button>
            </div>

            {/* Vrienden lijst */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden mb-4">
              <h3 className="text-sm font-bold p-4 pb-2">Je Vrienden</h3>
              <div className="divide-y divide-zinc-700">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center p-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-xl">
                        {friend.avatar || "👤"}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-800 ${
                          friend.status === "online"
                            ? "bg-green-500"
                            : friend.status === "training"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium flex items-center">
                        {friend.name}
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                          Lvl {friend.level}
                        </span>
                      </p>
                      <p className="text-xs text-zinc-400">
                        {friend.status === "online"
                          ? "Online"
                          : friend.status === "training"
                          ? "In training"
                          : `Laatst actief: ${friend.lastActive}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded"
                        onClick={() => {
                          setShowFriendsPanel(false);
                          setActiveChat(friend.id);
                        }}
                      >
                        💬
                      </button>
                    </div>
                  </div>
                ))}
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
                        <p className="text-xs text-zinc-400">
                          Wil je vriend worden
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-1.5 bg-green-500 rounded"
                          onClick={() => {
                            alert(
                              `Je hebt ${friend.name}'s verzoek geaccepteerd!`
                            );
                            setFriendRequests(
                              friendRequests.filter(
                                (req) => req.id !== friend.id
                              )
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
                              friendRequests.filter(
                                (req) => req.id !== friend.id
                              )
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

            {/* Vrienden activiteit sectie */}
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <h2 className="text-sm font-bold mb-3">Vrienden Activiteit</h2>
              <div className="space-y-3">
                {friendActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-lg mr-2">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.name}</span>{" "}
                        {activity.activity}
                      </p>
                      <p className="text-xs text-zinc-400">{activity.time}</p>
                    </div>
                    <button
                      className="text-xs bg-blue-500 px-2 py-1 rounded"
                      onClick={() =>
                        alert(`Reactie verzonden naar ${activity.name}`)
                      }
                    >
                      👍
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
