"use client";
import { useState } from "react";
import GoalProjector from "./goalprojector/page";
import MobileApp from "./mobileapp/page";
import { DataProvider } from "./components/DataContext";

export default function Home() {
  const openGoalProjector = () => {
    window.open("/goalprojector", "_blank");
  };

  return (
    <DataProvider>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-zinc-900 w-full min-h-screen p-8">
        <div className="relative">
          <MobileApp />
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={openGoalProjector}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Open Goal Projector
          </button>
        </div>
      </div>
    </DataProvider>
  );
}
