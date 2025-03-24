"use client";
import { useState } from "react";
import Link from "next/link";
import { useData } from "../components/DataContext";

export default function FootballPage() {
  const [isCasting, setIsCasting] = useState(false);
  const { addShot } = useData();

  // Functie om casting te starten/stoppen
  const toggleCasting = () => {
    setIsCasting(!isCasting);
    // Hier zou je de echte Chromecast-integratie implementeren
  };

  // Functie om target te wijzigen (communiceert met de geprojecteerde pagina)
  const changeTarget = () => {
    // Stuur bericht naar geprojecteerde pagina
    console.log("Change target requested");
    // Implementeer hier de communicatie met de geprojecteerde pagina
  };

  // Functie om een schot te nemen
  const takeShot = () => {
    // Stuur bericht naar geprojecteerde pagina
    console.log("Shot requested");
    // Implementeer hier de communicatie met de geprojecteerde pagina
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-zinc-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Football Training</h1>

      <div className="w-full max-w-md bg-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Goal Projector</h2>
          <button
            onClick={toggleCasting}
            className={`px-4 py-2 rounded ${
              isCasting ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {isCasting ? "Stop Casting" : "Cast to Display"}
          </button>
        </div>

        {isCasting ? (
          <div className="space-y-4">
            <p className="text-green-400">✓ Currently casting to display</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={changeTarget}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Change Target
              </button>
              <button
                onClick={takeShot}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Take Shot
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400 mb-4">
              Cast to a display to start training
            </p>
            <Link
              href="/goalprojector"
              className="px-4 py-2 bg-zinc-700 rounded"
            >
              Preview Goal Projector
            </Link>
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-xl mb-4">Recent Shots</h2>
        {/* Hier kun je recente schoten weergeven */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <p className="text-zinc-400 text-center">No recent shots</p>
        </div>
      </div>
    </div>
  );
}
