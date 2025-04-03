"use client";

import React from "react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollProps {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  onVote: (pollId: string, optionId: string) => void;
  isComplete?: boolean;
  onClose?: () => void;
}

const Poll: React.FC<PollProps> = ({
  id,
  question,
  options,
  totalVotes,
  hasVoted,
  onVote,
  isComplete,
  onClose,
}) => {
  if (!hasVoted && !isComplete) {
    return (
      <div className="bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-700 font-poppins">
        <h3 className="font-medium text-white mb-3">{question}</h3>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onVote(id, option.id)}
              className="w-full p-2 text-left rounded-lg border border-gray-700 hover:bg-zinc-700 transition-colors text-white"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-4 shadow-sm border border-gray-700 font-poppins">
      <h3 className="font-medium text-white mb-3">
        {question}
        {isComplete && (
          <span className="text-sm text-gray-300 ml-2">• Eindresultaat</span>
        )}
      </h3>
      <div className="space-y-2">
        {options.map((option) => {
          const percentage =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isWinner =
            isComplete &&
            option.votes === Math.max(...options.map((o) => o.votes));

          return (
            <div key={option.id} className="relative">
              <div
                className={`absolute inset-0 ${
                  isWinner ? "bg-blue-900/50" : "bg-zinc-700/50"
                } rounded-lg transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
              <div className="relative p-2 flex justify-between items-center">
                <span className="flex items-center gap-2 text-white">
                  {option.text}
                  {isWinner && <span className="text-blue-400">✓</span>}
                </span>
                <span className="text-sm text-gray-300">{percentage}%</span>
              </div>
            </div>
          );
        })}
        <p className="text-sm text-gray-400 mt-2">
          {totalVotes} stemmen{" "}
          {isComplete
            ? "• Peiling beëindigd"
            : "• Wachten op andere stemmen..."}
        </p>
      </div>
    </div>
  );
};

export default Poll;
