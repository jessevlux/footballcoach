"use client";

import { useState, useEffect } from "react";
import { useData, DataProvider } from "../components/DataContext";
import ShotVisualizer from "../components/ShotVisualizer";

// Voeg deze type declaratie toe bovenaan het bestand
declare global {
  interface Window {
    cast: {
      framework: {
        CastReceiverContext: any;
        CastReceiverOptions: any;
      };
    };
  }
}

function GoalProjectorContent() {
  const [target, setTarget] = useState({ x: 0.5, y: 0.5 });
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isCastReceiver, setIsCastReceiver] = useState(false);
  const [showShot, setShowShot] = useState(false);
  const [shotPosition, setShotPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [latestShot, setLatestShot] = useState<{
    accuracy: string;
    points: number;
    speed: number;
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { addShot } = useData();

  useEffect(() => {
    // Controleer of we in fullscreen mode moeten openen
    const isFullscreen = window.location.href.includes("fullscreen=true");

    if (isFullscreen) {
      // Vraag fullscreen aan
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    }

    // Controleer of we in een ontvanger context zijn
    const isSender = window.location.href.includes("sender=true");

    if (isSender) {
      console.log("Sender mode gedetecteerd");

      // Luister naar berichten van de sender
      window.addEventListener("message", (event) => {
        // Controleer of het bericht van dezelfde oorsprong komt
        if (event.origin === window.location.origin) {
          console.log("Bericht ontvangen:", event.data);
          handleCastMessage(event.data);
        }
      });
    }

    // Luister naar berichten van de Cast zender
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Initialiseer de Cast ontvanger
  const initializeCastReceiver = () => {
    // @ts-ignore
    const castReceiverContext =
      window.cast.framework.CastReceiverContext.getInstance();
    const options = new window.cast.framework.CastReceiverOptions();
    options.disableIdleTimeout = true;

    // Voeg een aangepaste berichtenkanaal toe
    const namespace = "urn:x-cast:com.footballcoach.app";
    castReceiverContext.addCustomMessageListener(
      namespace,
      (event: { data: any }) => {
        const message = event.data;
        handleCastMessage(message);
      }
    );

    castReceiverContext.start(options);
  };

  // Verwerk berichten van de Cast zender
  const handleCastMessage = (message: any) => {
    console.log("Received cast message:", message);

    switch (message.type) {
      case "CHANGE_TARGET":
        changeRandomTarget();
        break;
      case "TAKE_SHOT":
        simulateShot();
        break;
      default:
        break;
    }
  };

  // Verwerk berichten van het venster (voor lokale ontwikkeling)
  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      handleCastMessage(event.data);
    }
  };

  // Verander het doel naar een willekeurige positie
  const changeRandomTarget = () => {
    const newTargetIndex = Math.floor(Math.random() * 8);
    setTargetIndex(newTargetIndex);

    // Bereken x,y coördinaten op basis van index
    const col = newTargetIndex % 4;
    const row = Math.floor(newTargetIndex / 4);
    setTarget({
      x: (col + 0.5) / 4,
      y: (row + 0.5) / 2,
    });
  };

  // Simuleer een schot (voor demo doeleinden)
  const simulateShot = () => {
    // Hier zou je een animatie kunnen toevoegen
    console.log("Shot taken at target:", target);
  };

  // Convert grid index to x,y coordinates (center of the zone) - aangepast voor 2x4 grid
  const getZoneCenter = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    // Bereken het exacte centrum van de cel
    const centerX = col * 0.25 + 0.125; // Center of zone horizontally (0-1)
    const centerY = row * 0.5 + 0.25; // Aangepast voor 2 rijen (0-1)

    console.log(
      `Zone ${index} center: (${centerX.toFixed(4)}, ${centerY.toFixed(
        4
      )}), row: ${row}, col: ${col}`
    );

    return {
      x: centerX,
      y: centerY,
    };
  };

  // Functie om dartbord te tekenen met 3 ringen
  const renderDartboard = (index: number) => {
    if (index !== targetIndex) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Buitenste ring (1 punt) */}
        <div
          className="absolute rounded-full bg-red-500/80"
          style={{ width: "90%", height: "90%" }}
        ></div>
        {/* Middelste ring (3 punten) */}
        <div
          className="absolute rounded-full bg-blue-500/80"
          style={{ width: "50%", height: "50%" }}
        ></div>
        {/* Bullseye (5 punten) */}
        <div
          className="absolute rounded-full bg-yellow-400/80"
          style={{ width: "20%", height: "20%" }}
        ></div>
      </div>
    );
  };

  // Nieuwe functie voor het genereren van een schot
  const generateShot = () => {
    if (targetIndex === null) return;

    // Bereken het centrum van de target cel
    const targetCol = targetIndex % 4;
    const targetRow = Math.floor(targetIndex / 4);

    // Bereken de basis positie van het centrum van de cel
    // Aangepaste berekening voor betere uitlijning met de visuele weergave
    const cellCenterX = (targetCol + 0.5) / 4;

    // Pas de Y-positie aan voor de onderste rij
    // Voor de bovenste rij (row 0) gebruiken we de standaard berekening
    // Voor de onderste rij (row 1) passen we een offset toe
    const cellCenterY =
      targetRow === 0
        ? (targetRow + 0.5) / 2 // Bovenste rij
        : (targetRow + 0.35) / 2; // Onderste rij - aangepast voor betere uitlijning

    // Genereer een willekeurige offset met meer spreiding
    // We gebruiken een grotere offset om het hele dartbord te kunnen raken
    const randomOffset = () => (Math.random() - 0.5) * 0.6;

    // Bereken de exacte positie van het schot
    const shotX = Math.max(0, Math.min(1, cellCenterX + randomOffset() / 4));
    const shotY = Math.max(0, Math.min(1, cellCenterY + randomOffset() / 2));

    setShotPosition({ x: shotX, y: shotY });
    setShowShot(true);

    // Bereken in welke zone het schot is terechtgekomen
    const zoneX = Math.floor(shotX * 4);
    const zoneY = Math.floor(shotY * 2);
    const actualIndex = zoneY * 4 + zoneX;

    // Bereken de relatieve positie binnen de cel (0-1 voor beide assen)
    const cellX = (shotX * 4) % 1;
    const cellY = (shotY * 2) % 1;

    // Bereken de afstand tot het midden van de cel (0.5, 0.5)
    // Voor de onderste rij passen we het middelpunt aan
    const cellMidX = 0.5;
    const cellMidY = targetRow === 0 ? 0.5 : 0.35; // Aangepast voor onderste rij

    const distanceFromCenter = Math.sqrt(
      Math.pow(cellX - cellMidX, 2) + Math.pow(cellY - cellMidY, 2)
    );

    // Bepaal de score op basis van de afstand tot het midden
    let accuracy = "Missed";
    let points = 0;

    // Als het schot niet in de juiste zone is, is het een miss
    if (actualIndex !== targetIndex) {
      accuracy = "Missed";
      points = 0;
    } else {
      // Bepaal de score op basis van de afstand tot het midden
      // De maximale afstand tot het midden is sqrt(0.5^2 + 0.5^2) = 0.707
      // We normaliseren de afstand tot een waarde tussen 0 en 1
      const normalizedDistance = distanceFromCenter / 0.707;

      // Bepaal de score op basis van de genormaliseerde afstand
      if (normalizedDistance < 0.2) {
        // Bullseye (geel) - 20% van de maximale afstand
        accuracy = "Bullseye";
        points = 5;

        // Toon confetti bij een bullseye
        setShowConfetti(true);
        // Verberg confetti na 2 seconden
        setTimeout(() => {
          setShowConfetti(false);
        }, 2000);
      } else if (normalizedDistance < 0.45) {
        // Middelste ring (blauw) - 50% van de maximale afstand
        accuracy = "Good";
        points = 3;
      } else if (normalizedDistance < 0.9) {
        // Buitenste ring (rood) - 90% van de maximale afstand
        accuracy = "Fair";
        points = 1;
      } else {
        // Buiten alle ringen maar binnen dezelfde cel
        accuracy = "Poor";
        points = 0;
      }
    }

    console.log(`
      Shot details:
      - Target cell: (${targetCol}, ${targetRow}) [index: ${targetIndex}]
      - Shot position: (${shotX.toFixed(4)}, ${shotY.toFixed(4)})
      - Cell position: (${cellX.toFixed(4)}, ${cellY.toFixed(4)})
      - Distance from center: ${distanceFromCenter.toFixed(4)} (normalized: ${(
      distanceFromCenter / 0.707
    ).toFixed(4)})
      - Actual cell: (${zoneX}, ${zoneY}) [index: ${actualIndex}]
      - Accuracy: ${accuracy}
      - Points: ${points}
    `);

    // Generate shot data
    const shot = {
      timestamp: new Date(),
      targetIndex,
      actualIndex,
      speed: Math.floor(Math.random() * 40) + 60,
      accuracy,
      points,
    };

    // Update latest shot info
    setLatestShot({
      accuracy: shot.accuracy,
      points: shot.points,
      speed: shot.speed,
    });

    addShot(shot);

    // Reset shot visualization after a delay
    setTimeout(() => {
      setShowShot(false);
      setShotPosition(null);
    }, 2000);
  };

  // Fix voor verdwijnende targets
  const handleChangeTarget = () => {
    // Zorg ervoor dat er altijd een target wordt geselecteerd
    // Beperk de targetIndex tot geldige waarden (0-7) voor een 2x4 grid
    const newTargetIndex = Math.floor(Math.random() * 8);
    setTargetIndex(newTargetIndex);

    // Log het nieuwe target voor debugging
    const newTarget = getZoneCenter(newTargetIndex);
    console.log(
      `New target set: ${newTargetIndex}, center: (${newTarget.x.toFixed(
        4
      )}, ${newTarget.y.toFixed(4)})`
    );

    setShowShot(false);
    setShotPosition(null);
  };

  // Zorg ervoor dat er bij het laden van de pagina altijd een target is
  useEffect(() => {
    handleChangeTarget();
  }, []); // Alleen uitvoeren bij eerste render

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-zinc-900 p-8">
      <div className="w-[80vw] h-[80vh] relative">
        {/* Confetti overlay - aangepast voor volledige schermgrootte */}
        {showConfetti && (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <img
              src="confetti.gif"
              alt="Confetti"
              className="w-screen h-screen object-cover"
              style={{
                mixBlendMode: "screen",
                opacity: 0.8,
              }}
            />
          </div>
        )}

        <img
          src="/goal1.svg"
          alt="Soccer goal"
          className="relative z-10"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />

        {/* Grid overlay - verplaatst naar boven */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ paddingBottom: "10%" }}
        >
          <div
            className="grid grid-cols-4 grid-rows-2"
            style={{
              width: "80%",
              height: "40%",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: "2px",
              marginTop: "-10%", // Verplaats de grid naar boven
            }}
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  aspectRatio: "1/1",
                  width: "100%",
                  height: "100%",
                }}
              >
                {renderDartboard(index)}
              </div>
            ))}
          </div>
        </div>

        {/* Shot marker - aangepast voor betere uitlijning met dartbord */}
        {showShot && shotPosition && (
          <div
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              left: `${shotPosition.x * 80 + 10}%`,
              top: `${shotPosition.y * 40 + 25}%`,
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-75" />
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
            <div className="absolute inset-[25%] bg-red-600 rounded-full" />
          </div>
        )}

        {/* Latest Shot Info */}
        {latestShot && (
          <div className="absolute top-4 right-4 bg-zinc-800 p-4 rounded-lg text-white z-40">
            <h3 className="text-xl font-semibold mb-2">Latest Shot</h3>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span
                  className={`font-bold ${
                    latestShot.accuracy === "Bullseye"
                      ? "text-yellow-400"
                      : latestShot.accuracy === "Good"
                      ? "text-blue-400"
                      : latestShot.accuracy === "Fair"
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {latestShot.accuracy}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Points:</span>
                <span className="font-semibold text-yellow-400">
                  {latestShot.points}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span>{latestShot.speed} km/h</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
          <button
            onClick={handleChangeTarget}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Change Target
          </button>
          <button
            onClick={generateShot}
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={targetIndex === null}
          >
            Generate Shot
          </button>
        </div>
      </div>

      {isCastReceiver && (
        <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded">
          Cast Receiver Active
        </div>
      )}
    </div>
  );
}

export default function GoalProjector() {
  return (
    <DataProvider>
      <GoalProjectorContent />
    </DataProvider>
  );
}
