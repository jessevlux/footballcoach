"use client";

import React, { useState } from "react";
import { FaTimes, FaUserPlus, FaSearch, FaUsers } from "react-icons/fa";

interface Friend {
  id: string;
  name: string;
  mutualFriends: number;
  lastActive: string;
  avatar: string;
}

// Current group members
const groupMembers: Friend[] = [
  {
    id: "g1",
    name: "Jij",
    mutualFriends: 0,
    lastActive: "Nu actief",
    avatar: "👤",
  },
  {
    id: "g2",
    name: "Alex",
    mutualFriends: 8,
    lastActive: "Nu actief",
    avatar: "🧑‍💼",
  },
  {
    id: "g3",
    name: "Taylor",
    mutualFriends: 6,
    lastActive: "1 uur geleden",
    avatar: "👩",
  },
  {
    id: "g4",
    name: "Jordan",
    mutualFriends: 4,
    lastActive: "30 min geleden",
    avatar: "🧑",
  },
];

// Keep existing suggestedFriends array...
const suggestedFriends: Friend[] = [
  {
    id: "1",
    name: "Mike Johnson",
    mutualFriends: 3,
    lastActive: "Nu actief",
    avatar: "🧑‍💼",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    mutualFriends: 5,
    lastActive: "2 uur geleden",
    avatar: "👩",
  },
  {
    id: "3",
    name: "David Lee",
    mutualFriends: 2,
    lastActive: "Nu actief",
    avatar: "👨",
  },
  {
    id: "4",
    name: "Emma Thompson",
    mutualFriends: 4,
    lastActive: "1 uur geleden",
    avatar: "👱‍♀️",
  },
  {
    id: "5",
    name: "James Rodriguez",
    mutualFriends: 6,
    lastActive: "Nu actief",
    avatar: "🧑",
  },
];

interface AddFriendsProps {
  onClose: () => void;
}

const AddFriends: React.FC<AddFriendsProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"members" | "add">("members");

  const handleAddFriend = (friendId: string) => {
    setAddedFriends((prev) => {
      const newSet = new Set(prev);
      newSet.add(friendId);
      return newSet;
    });
  };

  const filteredFriends = suggestedFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = groupMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 font-poppins">
      <div className="bg-zinc-800 rounded-lg w-[90%] max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white font-poppins">
              Groepsleden
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                activeTab === "members"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaUsers />
                Leden ({groupMembers.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                activeTab === "add"
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaUserPlus />
                Vrienden toevoegen
              </div>
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === "members" ? "Zoek leden..." : "Zoek vrienden..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-full text-sm bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-poppins"
            />
          </div>
        </div>

        {/* List content */}
        <div className="max-h-[400px] overflow-y-auto bg-zinc-900">
          {activeTab === "members"
            ? // Members list
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{member.avatar}</div>
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {member.name}
                        {member.id === "g1" && " (Jij)"}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {member.lastActive}
                      </p>
                    </div>
                  </div>
                  {member.id !== "g1" && (
                    <span className="text-xs text-gray-300">
                      {member.mutualFriends} mutual vrienden
                    </span>
                  )}
                </div>
              ))
            : // Add friends list
              filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{friend.avatar}</div>
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {friend.name}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {friend.mutualFriends} mutual vrienden •{" "}
                        {friend.lastActive}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(friend.id)}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                      addedFriends.has(friend.id)
                        ? "bg-green-700 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {addedFriends.has(friend.id) ? (
                      "Toegevoegd ✓"
                    ) : (
                      <>
                        <FaUserPlus className="w-3 h-3" />
                        Toevoegen
                      </>
                    )}
                  </button>
                </div>
              ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Klaar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriends;
