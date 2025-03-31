"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Shot = {
  timestamp: Date;
  targetIndex: number;
  actualIndex: number;
  speed: number;
  accuracy: string;
  points: number;
};

type DataContextType = {
  shots: Shot[];
  addShot: (shot: Shot) => void;
  latestShot: Shot | null;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to parse stored shots
const parseStoredShots = (shotsString: string | null): Shot[] => {
  if (!shotsString) return [];
  try {
    return JSON.parse(shotsString).map((shot: any) => ({
      ...shot,
      timestamp: new Date(shot.timestamp),
    }));
  } catch (e) {
    console.error("Error parsing shots:", e);
    return [];
  }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [shots, setShots] = useState<Shot[]>([]);
  const [challenges, setChallenges] = useState<Record<string, any>>({});

  // Load initial shots from localStorage
  useEffect(() => {
    const storedShots = localStorage.getItem("footballShots");
    setShots(parseStoredShots(storedShots));

    // Setup storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "footballShots") {
        setShots(parseStoredShots(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addShot = (shot: Shot) => {
    const newShots = [...shots, shot];
    setShots(newShots);
    // Store in localStorage and dispatch custom event
    localStorage.setItem("footballShots", JSON.stringify(newShots));
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new CustomEvent("shotsUpdated", { detail: newShots }));
  };

  return (
    <DataContext.Provider
      value={{ shots, addShot, latestShot: shots[shots.length - 1] || null }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Voeg een functie toe om challenges bij te werken
// Voeg deze toe aan de DataContext

const updateChallengeProgress = (challengeId: string, progress: number) => {
  const storedChallenges = localStorage.getItem("activeChallenges");
  let challenges: Record<string, any> = {};

  if (storedChallenges) {
    try {
      challenges = JSON.parse(storedChallenges);
    } catch (e) {
      console.error("Error parsing challenges:", e);
    }
  }

  challenges[challengeId] = {
    ...challenges[challengeId],
    progress: progress,
  };

  localStorage.setItem("activeChallenges", JSON.stringify(challenges));
};
