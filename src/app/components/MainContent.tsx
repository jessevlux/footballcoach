"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaFutbol, FaUserFriends, FaMapMarkedAlt, FaRandom, FaTimes, FaComments, FaTrophy, FaShareAlt, FaCheck } from 'react-icons/fa';
import { User } from '@/models/User';
import GroupChat from './GroupChat';

// Define simple interfaces for our local data
interface Friend {
    id: string;
    name: string;
    status: 'online' | 'offline';
    lastSeen?: Date;
}

interface Match {
    id: string;
    title: string;
    location: string;
    date: Date;
    organizer: string;
    players: string[];
    maxPlayers: number;
    chatMessages?: ChatMessage[];
    checkedInPlayers?: string[];
}

interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    matchId: string;
    text: string;
    timestamp: Date;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
}

interface MainContentProps {
    user: User;
}

const MainContent: React.FC<MainContentProps> = ({ user }) => {
    // State for managing matches
    const [myMatches, setMyMatches] = useState<Match[]>([]);
    const [availableMatches, setAvailableMatches] = useState<Match[]>([
        {
            id: "match1",
            title: "Saturday Morning Match",
            location: "Central Park",
            date: new Date(Date.now() + 86400000), // Tomorrow
            organizer: "Local Organizer",
            players: ["player1", "player2"],
            maxPlayers: 10,
            chatMessages: [],
            checkedInPlayers: []
        },
        {
            id: "match2",
            title: "Sunday Pickup Game",
            location: "Riverside Fields",
            date: new Date(Date.now() + 172800000), // Day after tomorrow
            organizer: "Community League",
            players: ["player3", "player4", "player5"],
            maxPlayers: 14,
            chatMessages: [],
            checkedInPlayers: []
        }
    ]);

    // State for UI controls
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showFindMatches, setShowFindMatches] = useState(false);
    const [newMatch, setNewMatch] = useState<Omit<Match, 'id' | 'players'>>({
        title: '',
        location: '',
        date: new Date(),
        organizer: user.name,
        maxPlayers: 10
    });

    // Chat and friends state
    const [friends, setFriends] = useState<Friend[]>([
        { id: "friend1", name: "Alex", status: "online" },
        { id: "friend2", name: "Taylor", status: "online" },
        { id: "friend3", name: "Jordan", status: "offline", lastSeen: new Date(Date.now() - 3600000) }
    ]);
    const [selectedChatMatch, setSelectedChatMatch] = useState<Match | null>(null);
    const [chatMessage, setChatMessage] = useState("");
    const [showChat, setShowChat] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Achievements and gamification
    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: "ach1",
            title: "First Match",
            description: "Join your first soccer match",
            icon: <FaFutbol />,
            unlocked: false
        },
        {
            id: "ach2",
            title: "Organizer",
            description: "Create your first match",
            icon: <FaUserFriends />,
            unlocked: false
        },
        {
            id: "ach3",
            title: "Social Butterfly",
            description: "Send 5 chat messages",
            icon: <FaComments />,
            unlocked: false
        }
    ]);
    const [showAchievements, setShowAchievements] = useState(false);
    const [messageCount, setMessageCount] = useState(0);

    // Handle creating a new match
    const handleCreateMatch = () => {
        const match: Match = {
            id: `match-${Date.now()}`,
            ...newMatch,
            players: [user.id],
            chatMessages: [],
            checkedInPlayers: []
        };

        setMyMatches([...myMatches, match]);
        setShowCreateForm(false);
        setNewMatch({
            title: '',
            location: '',
            date: new Date(),
            organizer: user.name,
            maxPlayers: 10
        });

        // Update user stats
        user.gamesOrganized += 1;
        user.points += 10;

        // Check achievement
        unlockAchievement("ach2");
    };

    // Handle joining a match
    const handleJoinMatch = (matchId: string) => {
        // Find the match in available matches
        const updatedAvailableMatches = availableMatches.map(match => {
            if (match.id === matchId) {
                // Check if user is already in this match
                if (!match.players.includes(user.id)) {
                    // Add user to players
                    return {
                        ...match,
                        players: [...match.players, user.id]
                    };
                }
            }
            return match;
        });

        setAvailableMatches(updatedAvailableMatches);

        // Check if this is the first match
        if (user.gamesPlayed === 0) {
            unlockAchievement("ach1");
        }

        // Update user stats
        user.gamesPlayed += 1;
        user.points += 5;
    };

    // Handle searching by location (simplified for local version)
    const handleSearchByLocation = () => {
        // Toggle visibility of available matches
        setShowFindMatches(!showFindMatches);
    };

    // Handle joining a random match
    const handleJoinRandomMatch = () => {
        if (availableMatches.length > 0) {
            // Pick a random match to join
            const randomIndex = Math.floor(Math.random() * availableMatches.length);
            handleJoinMatch(availableMatches[randomIndex].id);
            alert(`You joined: ${availableMatches[randomIndex].title}`);
        } else {
            alert("No available matches to join!");
        }
    };

    // Chat functionality
    const openChat = (match: Match) => {
        setSelectedChatMatch(match);
        setShowChat(true);
    };

    const sendMessage = () => {
        if (!chatMessage.trim() || !selectedChatMatch) return;

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            matchId: selectedChatMatch.id,
            text: chatMessage,
            timestamp: new Date()
        };

        // Update either myMatches or availableMatches based on which contains the selected match
        const isMyMatch = myMatches.some(m => m.id === selectedChatMatch.id);

        if (isMyMatch) {
            setMyMatches(myMatches.map(match => {
                if (match.id === selectedChatMatch.id) {
                    return {
                        ...match,
                        chatMessages: [...(match.chatMessages || []), newMessage]
                    };
                }
                return match;
            }));
        } else {
            setAvailableMatches(availableMatches.map(match => {
                if (match.id === selectedChatMatch.id) {
                    return {
                        ...match,
                        chatMessages: [...(match.chatMessages || []), newMessage]
                    };
                }
                return match;
            }));
        }

        // Update selected chat
        setSelectedChatMatch({
            ...selectedChatMatch,
            chatMessages: [...(selectedChatMatch.chatMessages || []), newMessage]
        });

        // Clear message input
        setChatMessage("");

        // Track message count for achievement
        const newCount = messageCount + 1;
        setMessageCount(newCount);
        if (newCount >= 5) {
            unlockAchievement("ach3");
        }
    };

    // Check-in functionality
    const handleCheckIn = (matchId: string) => {
        // Find and update the match where the user is checking in
        const isMyMatch = myMatches.some(m => m.id === matchId);

        if (isMyMatch) {
            setMyMatches(myMatches.map(match => {
                if (match.id === matchId) {
                    return {
                        ...match,
                        checkedInPlayers: [...(match.checkedInPlayers || []), user.id]
                    };
                }
                return match;
            }));
        } else {
            setAvailableMatches(availableMatches.map(match => {
                if (match.id === matchId) {
                    return {
                        ...match,
                        checkedInPlayers: [...(match.checkedInPlayers || []), user.id]
                    };
                }
                return match;
            }));
        }

        alert("You've successfully checked in!");
        user.points += 2; // Bonus points for checking in
    };

    // Share match (simulated)
    const shareMatch = (match: Match) => {
        const shareText = `Join me for soccer: ${match.title} at ${match.location} on ${match.date.toLocaleDateString()}`;
        alert(`Sharing: ${shareText}`);
        user.points += 3; // Points for sharing
    };

    // Achievement handling
    const unlockAchievement = (achievementId: string) => {
        const updatedAchievements = achievements.map(achievement => {
            if (achievement.id === achievementId && !achievement.unlocked) {
                user.points += 15; // Bonus points for unlocking achievement
                return { ...achievement, unlocked: true };
            }
            return achievement;
        });
        setAchievements(updatedAchievements);
    };

    // Scroll to bottom of chat when new messages arrive
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChatMatch?.chatMessages]);

    // Helper function to determine if user is checked in
    const isUserCheckedIn = (match: Match) => {
        return match.checkedInPlayers?.includes(user.id) || false;
    };

    const handleLocationShare = (location: string) => {
        // Create a new match at the shared location
        const newMatch = {
            id: `match-${Date.now()}`,
            title: "Squad Meetup",
            location: location,
            date: new Date(Date.now() + 3600000), // 1 hour from now
            organizer: user.name,
            maxPlayers: 10,
            players: [user.id],
            chatMessages: [],
            checkedInPlayers: []
        };

        setMyMatches([...myMatches, newMatch]);
        user.gamesOrganized += 1;
        user.points += 5;
    };

    return (
        <div className="space-y-4">
            {/* User stats bar */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                    <p className="text-black font-medium text-sm">Welcome, {user.name}!</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded font-medium">
                            {user.points} pts
                        </span>
                        <span className="text-xs bg-green-100 text-green-900 px-2 py-1 rounded font-medium">
                            {user.gamesPlayed} played
                        </span>
                    </div>
                </div>
            </div>

            {/* Add Group Chat before Your Matches section */}
            <GroupChat userName={user.name} onLocationShare={handleLocationShare} />

            {/* Your Matches */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-base font-semibold mb-2 text-black flex items-center">
                    <FaUserFriends className="mr-1 text-sm" /> Your Matches
                </h2>

                {myMatches.length > 0 ? (
                    <div className="space-y-2">
                        {myMatches.map(match => (
                            <div key={match.id} className="border p-2 rounded-md bg-blue-50 text-sm">
                                <h3 className="font-medium text-black">{match.title}</h3>
                                <p className="text-xs text-black">Location: {match.location}</p>
                                <p className="text-xs text-black">
                                    Date: {match.date.toLocaleDateString()}
                                </p>
                                <p className="text-xs text-black">
                                    Players: {match.players.length}/{match.maxPlayers}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-black text-sm">No matches found. Create one below!</p>
                )}

                {!showCreateForm ? (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition font-medium text-sm"
                    >
                        Create Match
                    </button>
                ) : (
                    <div className="mt-2 border p-3 rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-black text-sm">Create New Match</h3>
                            <button onClick={() => setShowCreateForm(false)} className="text-black">
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="block text-xs mb-1 text-black font-medium">Title</label>
                                <input
                                    type="text"
                                    value={newMatch.title}
                                    onChange={e => setNewMatch({ ...newMatch, title: e.target.value })}
                                    className="w-full p-1 border rounded text-black text-sm"
                                    placeholder="Saturday Friendly"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1 text-black font-medium">Location</label>
                                <input
                                    type="text"
                                    value={newMatch.location}
                                    onChange={e => setNewMatch({ ...newMatch, location: e.target.value })}
                                    className="w-full p-1 border rounded text-black text-sm"
                                    placeholder="Central Park Field #3"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1 text-black font-medium">Date</label>
                                <input
                                    type="date"
                                    value={newMatch.date.toISOString().split('T')[0]}
                                    onChange={e => setNewMatch({ ...newMatch, date: new Date(e.target.value) })}
                                    className="w-full p-1 border rounded text-black text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1 text-black font-medium">Max Players</label>
                                <input
                                    type="number"
                                    value={newMatch.maxPlayers}
                                    onChange={e => setNewMatch({ ...newMatch, maxPlayers: parseInt(e.target.value) })}
                                    className="w-full p-1 border rounded text-black text-sm"
                                    min="2"
                                    max="22"
                                />
                            </div>

                            <button
                                onClick={handleCreateMatch}
                                disabled={!newMatch.title || !newMatch.location}
                                className="w-full bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm"
                            >
                                Create Match
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Find Matches */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-base font-semibold mb-2 text-black flex items-center">
                    <FaMapMarkedAlt className="mr-1 text-sm" /> Find Matches
                </h2>

                <div className="flex space-x-2">
                    <button
                        onClick={handleSearchByLocation}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition flex items-center justify-center font-medium text-sm flex-1"
                    >
                        <FaMapMarkedAlt className="mr-1 text-xs" /> Search
                    </button>

                    <button
                        onClick={handleJoinRandomMatch}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition flex items-center justify-center font-medium text-sm flex-1"
                    >
                        <FaRandom className="mr-1 text-xs" /> Random
                    </button>
                </div>

                {showFindMatches && (
                    <div className="mt-2 border-t pt-2">
                        <h3 className="font-medium mb-2 text-black text-sm">Available Matches</h3>
                        {availableMatches.length > 0 ? (
                            <div className="space-y-2">
                                {availableMatches.map(match => (
                                    <div key={match.id} className="border p-2 rounded-md bg-white text-sm">
                                        <h3 className="font-medium text-black text-xs">{match.title}</h3>
                                        <p className="text-xs text-black">Location: {match.location}</p>
                                        <p className="text-xs text-black">
                                            Date: {match.date.toLocaleDateString()}
                                        </p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-black">
                                                Players: {match.players.length}/{match.maxPlayers}
                                            </p>
                                            <button
                                                onClick={() => handleJoinMatch(match.id)}
                                                className="bg-green-100 text-green-900 px-2 py-0.5 rounded text-xs font-medium"
                                            >
                                                Join
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-black text-sm">No available matches found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainContent; 