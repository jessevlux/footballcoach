"use client";

import { useState } from "react";

export default function GoalProjector() {
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  return (
    <div className="flex justify-center items-center w-full bg-zinc-900">
      <div className="w-[80vw] h-[80vh] bg-[url('/goal1.svg')] bg-contain bg-no-repeat bg-center">
        <div className="grid grid-cols-4 grid-rows-3 gap-4 bg-[#ffffff54] mt-10 h-[75%] w-[80%] mx-auto">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={`h-full w-full ${
                index === randomIndex ? "bg-green-600" : "bg-transparent"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            setRandomIndex(Math.floor(Math.random() * 12));
          }}
          className="p-2 mt-2 bg-blue-500 text-white rounded mx-auto block"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          Change Target
        </button>
      </div>
    </div>
  );
}
