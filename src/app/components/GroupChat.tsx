"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import Poll from "./Poll";
import AddFriends from "./AddFriends";
import { v4 as uuidv4 } from "uuid";

interface GroupChatProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  type?: "poll" | "location" | "training" | "weather" | "regular" | "vote";
  pollId?: string;
  votes?: {
    option1: number;
    option2: number;
    option3: number;
    option4: number;
  };
  hasVoted?: boolean;
  isComplete?: boolean;
}

const GroupChat: React.FC<GroupChatProps> = ({ onClose }) => {
  const { darkMode } = useTheme();
  const [message, setMessage] = useState("");
  const [showPoll, setShowPoll] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [customLocation, setCustomLocation] = useState("");

  // Mock data voor berichten
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Coach",
      avatar: "👨‍🦲",
      text: "Training verplaatst naar 18:00",
      time: "10:30",
      type: "regular",
    },
    {
      id: "2",
      sender: "Thomas",
      avatar: "🧑‍🦱",
      text: "Ik kan er helaas niet bij zijn vanavond",
      time: "10:35",
      type: "regular",
    },
    {
      id: "3",
      sender: "Kevin",
      avatar: "👨‍🦰",
      text: "Ik ben er wel!",
      time: "10:40",
      type: "regular",
    },
    {
      id: "4",
      sender: "Sophie",
      avatar: "👱‍♀️",
      text: "Ik ook, tot vanavond!",
      time: "10:45",
      type: "regular",
    },
    {
      id: "5",
      sender: "Jij",
      avatar: "😎",
      text: "Ik neem de nieuwe ballen mee",
      time: "10:50",
      type: "regular",
    },
  ]);

  // Scroll naar beneden wanneer er nieuwe berichten zijn
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: "Jij",
      avatar: "😎",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "regular",
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simuleer een reactie van een andere gebruiker na een korte vertraging
    setTimeout(() => {
      const responders = ["Thomas", "Kevin", "Sophie", "Coach"];
      const avatars = ["🧑‍🦱", "👨‍🦰", "👱‍♀️", "👨‍🦲"];
      const responses = [
        "Klinkt goed!",
        "Ik kom ook!",
        "Prima idee",
        "Vergeet niet extra water mee te nemen, het wordt warm",
        "Zullen we een extra keeperstraining doen?",
      ];

      const randomResponder = Math.floor(Math.random() * responders.length);
      const randomResponse = Math.floor(Math.random() * responses.length);

      const responseMessage: ChatMessage = {
        id: uuidv4(),
        sender: responders[randomResponder],
        avatar: avatars[randomResponder],
        text: responses[randomResponse],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "regular",
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1500);
  };

  const shareLocation = () => {
    setShowLocationInput(true);
  };

  const handleLocationSubmit = () => {
    if (customLocation.trim()) {
      const locationMessage: ChatMessage = {
        id: uuidv4(),
        sender: "Jij",
        avatar: "😎",
        text: `📍 Laten we afspreken bij ${customLocation}!`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "location",
      };

      setMessages([...messages, locationMessage]);
      setCustomLocation("");
      setShowLocationInput(false);
    }
  };

  // Training suggesties
  const trainingIdeas = [
    "Snelle passoefening - 15 min",
    "Schietoefening - 20 min",
    "Dribbelparcours - 10 min",
    "Mini-wedstrijd 3 tegen 3 - 30 min",
  ];

  // Controleer het weer
  const checkWeather = () => {
    const weatherMessage: ChatMessage = {
      id: uuidv4(),
      sender: "Weer Bot",
      avatar: "🌤",
      text: "Weer voor de training vandaag: Zonnig, 22°C, Perfect voor voetbal!",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "weather",
    };

    setMessages([...messages, weatherMessage]);
  };

  // Deel een trainingsplan
  const shareTrainingPlan = () => {
    const plan =
      trainingIdeas[Math.floor(Math.random() * trainingIdeas.length)];

    const trainingMessage: ChatMessage = {
      id: uuidv4(),
      sender: "Jij",
      avatar: "😎",
      text: `📋 Trainingsvoorstel: ${plan}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "training",
    };

    setMessages([...messages, trainingMessage]);
  };

  const handlePollClick = () => {
    const pollMessage: ChatMessage = {
      id: uuidv4(),
      sender: "Jij",
      avatar: "😎",
      text: "Wanneer kunnen we trainen?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "poll",
      votes: { option1: 0, option2: 0, option3: 0, option4: 0 },
      hasVoted: false,
      isComplete: false,
    };

    setMessages([...messages, pollMessage]);
  };

  // Voeg deze constante toe voor groepsleden
  const GROUP_MEMBERS = ["Thomas", "Kevin", "Sophie", "Coach", "Jij"];

  // Maak een helper-functie om ervoor te zorgen dat votes altijd geldig zijn
  const getDefaultVotes = (votes?: {
    option1?: number;
    option2?: number;
    option3?: number;
    option4?: number;
  }) => {
    return {
      option1: votes?.option1 || 0,
      option2: votes?.option2 || 0,
      option3: votes?.option3 || 0,
      option4: votes?.option4 || 0,
    };
  };

  if (showAddFriends) {
    return <AddFriends onClose={() => setShowAddFriends(false)} />;
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center">
        <div className="flex items-center flex-1">
          <button onClick={onClose} className="text-zinc-400 mr-2">
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
          <div className="flex items-center">
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xl mr-2">
              🥅
            </div>
            <div>
              <h2 className="text-sm font-bold">FC Doelpunt</h2>
              <p className="text-xs text-zinc-400">5 leden</p>
            </div>
          </div>
        </div>
        <button className="text-zinc-400">
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 mb-auto pb-[130px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "Jij" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== "Jij" && (
              <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xl mr-2">
                {msg.avatar}
              </div>
            )}
            {msg.type === "poll" ? (
              <Poll
                id={msg.id}
                question="Wanneer kunnen we trainen?"
                options={[
                  {
                    id: "1",
                    text: "Vandaag 18:00",
                    votes: msg.votes?.option1 || 0,
                  },
                  {
                    id: "2",
                    text: "Vandaag 20:00",
                    votes: msg.votes?.option2 || 0,
                  },
                  {
                    id: "3",
                    text: "Morgen 17:00",
                    votes: msg.votes?.option3 || 0,
                  },
                  {
                    id: "4",
                    text: "Morgen 19:00",
                    votes: msg.votes?.option4 || 0,
                  },
                ]}
                totalVotes={
                  (msg.votes?.option1 || 0) +
                  (msg.votes?.option2 || 0) +
                  (msg.votes?.option3 || 0) +
                  (msg.votes?.option4 || 0)
                }
                hasVoted={msg.hasVoted || false}
                isComplete={msg.isComplete || false}
                onVote={(pollId, optionId) => {
                  // Voeg je eigen stem toe
                  const optionKey = `option${optionId}`;

                  // Maak een kopie van de berichten met jouw stem toegevoegd
                  const updatedMessages = messages.map((m) => {
                    if (m.id === pollId) {
                      // Initialiseer votes object als het nog niet bestaat
                      const votes = m.votes || {
                        option1: 0,
                        option2: 0,
                        option3: 0,
                        option4: 0,
                      };
                      votes[optionKey as keyof typeof votes] =
                        (votes[optionKey as keyof typeof votes] || 0) + 1;

                      return {
                        ...m,
                        votes: votes,
                        hasVoted: true,
                        text: `Poll: Wanneer kunnen we trainen?`,
                      };
                    }
                    return m;
                  });

                  setMessages(updatedMessages);

                  // Na een korte vertraging, laat andere teamleden stemmen
                  setTimeout(() => {
                    // Voeg stemmen van andere teamleden toe (tussen 1-3 anderen)
                    const otherVotersCount = Math.floor(Math.random() * 3) + 1;

                    let updatedMsg = updatedMessages.find(
                      (m) => m.id === pollId
                    );
                    if (!updatedMsg) return;

                    for (let i = 0; i < otherVotersCount; i++) {
                      // Kies een willekeurige optie om op te stemmen
                      const randomOptionId = Math.floor(Math.random() * 4) + 1;
                      const randomOptionKey = `option${randomOptionId}`;

                      // Update votes voor die optie
                      const updatedVotes: {
                        option1: number;
                        option2: number;
                        option3: number;
                        option4: number;
                      } = getDefaultVotes(updatedMsg.votes);
                      updatedVotes[
                        randomOptionKey as keyof typeof updatedVotes
                      ] =
                        (updatedVotes[
                          randomOptionKey as keyof typeof updatedVotes
                        ] || 0) + 1;
                      updatedMsg = { ...updatedMsg, votes: updatedVotes };

                      // Voeg een bericht toe dat iemand heeft gestemd
                      const randomMemberIndex = Math.floor(
                        Math.random() * (GROUP_MEMBERS.length - 1)
                      ); // Exclude "Jij"
                      const voter = GROUP_MEMBERS[randomMemberIndex];
                      const optionText = [
                        "Vandaag 18:00",
                        "Vandaag 20:00",
                        "Morgen 17:00",
                        "Morgen 19:00",
                      ][randomOptionId - 1];

                      const voteMessage: ChatMessage = {
                        id: uuidv4(),
                        sender: voter,
                        avatar:
                          voter === "Thomas"
                            ? "🧑‍🦱"
                            : voter === "Kevin"
                            ? "👨‍🦰"
                            : voter === "Sophie"
                            ? "👱‍♀️"
                            : "👨‍🦲",
                        text: `Heeft gestemd op: ${optionText}`,
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        type: "vote",
                      };

                      updatedMessages.push(voteMessage);
                    }

                    // Als iedereen heeft gestemd, markeer de poll als voltooid
                    const totalVotes = Object.values(
                      getDefaultVotes(updatedMsg.votes)
                    ).reduce((sum, count) => sum + count, 0);
                    if (totalVotes >= 4) {
                      const finalMessages = updatedMessages.map((m) =>
                        m.id === pollId ? { ...m, isComplete: true } : m
                      );
                      setMessages(finalMessages);
                    } else {
                      setMessages(updatedMessages);
                    }
                  }, 1500);
                }}
              />
            ) : (
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === "Jij"
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-700"
                }`}
              >
                {msg.sender !== "Jij" && (
                  <p className="text-xs font-bold mb-1">{msg.sender}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 text-right ${
                    msg.sender === "Jij" ? "text-blue-200" : "text-zinc-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            )}
            {msg.sender === "Jij" && (
              <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xl ml-2">
                {msg.avatar}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Locatie input */}
      {showLocationInput && (
        <div className="p-4 border-t border-zinc-700">
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Voer locatie in..."
              className="flex-1 bg-zinc-800 rounded-l-full py-2 px-4 text-sm"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLocationSubmit();
                }
              }}
            />
            <button
              className="bg-blue-500 rounded-r-full py-2 px-4 text-sm"
              onClick={handleLocationSubmit}
            >
              Delen
            </button>
          </div>
          <button
            className="text-xs text-zinc-400"
            onClick={() => setShowLocationInput(false)}
          >
            Annuleren
          </button>
        </div>
      )}

      {/* Extra opties */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 w-full">
        <div className="p-2 border-t border-zinc-700 flex space-x-2 overflow-x-auto no-scrollbar">
          <button
            className="p-2 bg-zinc-700 rounded-full flex-shrink-0"
            onClick={handlePollClick}
            title="Maak een peiling"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-zinc-700 rounded-full flex-shrink-0"
            onClick={() => setShowAddFriends(true)}
            title="Voeg vrienden toe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-zinc-700 rounded-full flex-shrink-0"
            onClick={shareLocation}
            title="Deel locatie"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-zinc-700 rounded-full flex-shrink-0"
            onClick={checkWeather}
            title="Bekijk weer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-zinc-700 rounded-full flex-shrink-0"
            onClick={shareTrainingPlan}
            title="Deel trainingsplan"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-zinc-700 rounded-full flex-shrink-0"
            title="Foto/video delen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-zinc-700 flex items-center">
          <input
            type="text"
            inputMode="text"
            placeholder="Typ een bericht..."
            className="flex-1 bg-zinc-800 rounded-full py-2 px-4 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            className="ml-2 p-2 bg-blue-500 rounded-full"
            onClick={sendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        {/* Toetsenbord */}
        <div className="border-t border-zinc-700 py-1 px-2 bg-zinc-800 grid grid-cols-10 gap-1 text-center">
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
            <div key={key} className="p-2 bg-zinc-700 rounded">
              {key}
            </div>
          ))}
          <div className="col-span-10 grid grid-cols-9 gap-1 mt-1">
            {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
              <div key={key} className="p-2 bg-zinc-700 rounded">
                {key}
              </div>
            ))}
          </div>
          <div className="col-span-10 grid grid-cols-8 gap-1 mt-1">
            <div className="p-1 bg-zinc-600 rounded col-span-1 flex items-center justify-center">
              ⇧
            </div>
            {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
              <div key={key} className="p-2 bg-zinc-700 rounded">
                {key}
              </div>
            ))}
          </div>
          <div className="col-span-10 grid grid-cols-3 gap-1 mt-1">
            <div className="p-2 bg-zinc-600 rounded">123</div>
            <div className="p-2 bg-zinc-700 rounded col-span-1">😀</div>
            <div className="p-2 bg-zinc-700 rounded col-span-1 text-xs flex items-center justify-center">
              Ruimte
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
