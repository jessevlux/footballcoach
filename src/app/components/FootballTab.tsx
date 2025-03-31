"use client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { useData } from "./DataContext";
import Link from "next/link";
import Script from "next/script";

// Cast SDK types
declare global {
  interface Window {
    chrome: {
      cast: {
        isAvailable: boolean;
        framework: {
          CastContext: any;
          CastContextEventType: {
            SESSION_STATE_CHANGED: string;
          };
        };
        SessionState: {
          CONNECTED: string;
          DISCONNECTED: string;
        };
        AutoJoinPolicy: {
          ORIGIN_SCOPED: string;
        };
        media: {
          MediaInfo: any;
          LoadRequest: any;
        };
        SessionRequest: any;
        ApiConfig: any;
        initialize: any;
        requestSession: any;
      };
    };
    __onGCastApiAvailable: ((isAvailable: boolean) => void) | null;
  }
}

// Add these type declarations at the top of the file
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "google-cast-launcher": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function FootballTab() {
  const { darkMode } = useTheme();
  const { shots, latestShot, addShot } = useData();
  const [localShots, setLocalShots] = useState(shots);
  const [isCasting, setIsCasting] = useState(false);
  const [castAvailable, setCastAvailable] = useState(false);
  const castSession = useRef<any>(null);
  const castContext = useRef<any>(null);
  const bgColor = darkMode ? "bg-zinc-800" : "bg-white";
  const [showCastOverlay, setShowCastOverlay] = useState(false);

  // Update localShots wanneer shots verandert
  useEffect(() => {
    setLocalShots([...shots]);
  }, [shots]);

  // Initialiseer Google Cast API
  useEffect(() => {
    // @ts-ignore
    window["__onGCastApiAvailable"] = function (isAvailable: boolean) {
      if (isAvailable) {
        initializeCastApi();
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
    document.body.appendChild(script);

    return () => {
      // @ts-ignore
      window["__onGCastApiAvailable"] = undefined;
      document.body.removeChild(script);
    };
  }, []);

  const initializeCastApi = () => {
    // @ts-ignore
    const cast = window.chrome.cast;
    const sessionRequest = new cast.SessionRequest(
      "CC1AD845" // Default media receiver app ID
    );
    const apiConfig = new cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener
    );
    cast.initialize(apiConfig, onInitSuccess, onError);
  };

  const sessionListener = (session: any) => {
    console.log("Session listener", session);
    castSession.current = session;
    setIsCasting(true);
  };

  const receiverListener = (availability: string) => {
    console.log("Receiver listener", availability);
    if (availability === "available") {
      setCastAvailable(true);
    } else {
      setCastAvailable(false);
    }
  };

  const onInitSuccess = () => {
    console.log("Cast initialized");
    setCastAvailable(true);
  };

  const onError = (error: any) => {
    console.error("Cast error", error);
    setCastAvailable(false);
  };

  // Functie om te casten naar een apparaat
  const castToDevice = () => {
    // Deze functie wordt automatisch aangeroepen door de Google Cast button
    console.log("Casting to device...");
  };

  // Start casting
  const startCasting = () => {
    if (castContext.current) {
      castContext.current
        .requestSession()
        .then(() => {
          console.log("Cast session started");
        })
        .catch((error: any) => {
          console.error("Error starting cast session:", error);
        });
    }
  };

  // Stop casting
  const stopCasting = () => {
    if (castSession.current) {
      castSession.current.endSession(true);
    }
  };

  // Toggle casting
  const toggleCasting = () => {
    if (isCasting) {
      stopCasting();
    } else {
      startCasting();
    }
  };

  // Stuur een bericht naar de ontvanger
  const sendMessage = (message: any) => {
    if (castSession.current) {
      try {
        if (castSession.current.window) {
          // Stuur bericht naar het geopende venster
          castSession.current.window.postMessage(
            message,
            window.location.origin
          );
          console.log("Message sent to window:", message);
        } else if (castSession.current.media && castSession.current.media[0]) {
          // Gebruik de media sessie om berichten te sturen
          const namespace = "urn:x-cast:com.footballcoach.app";
          castSession.current.media[0]
            .sendMessage(namespace, message)
            .then(() => {
              console.log("Message sent via media:", message);
            })
            .catch((error: any) => {
              console.error("Error sending message via media:", error);
            });
        } else if (castSession.current.sendMessage) {
          // Probeer direct via de sessie te sturen
          const namespace = "urn:x-cast:com.footballcoach.app";
          castSession.current
            .sendMessage(namespace, message)
            .then(() => {
              console.log("Message sent via session:", message);
            })
            .catch((error: any) => {
              console.error("Error sending message via session:", error);
            });
        } else {
          console.error("Geen methode gevonden om berichten te sturen");
        }
      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    } else {
      console.error("Geen cast sessie beschikbaar");
    }
  };

  // Functie om target te wijzigen
  const changeTarget = () => {
    sendMessage({ type: "CHANGE_TARGET" });
  };

  // Functie om een schot te nemen
  const takeShot = () => {
    sendMessage({ type: "TAKE_SHOT" });

    // Test: voeg een nieuw schot toe om te zien of de lijst wordt bijgewerkt
    const testShot = {
      timestamp: new Date(),
      speed: Math.floor(Math.random() * 30) + 60,
      accuracy: "Bullseye",
      points: 10,
      targetIndex: 0,
      actualIndex: 0,
    };
    addShot(testShot);
  };

  // Bereken de werkelijke precisie
  const calculateAccuracy = () => {
    if (shots.length === 0) return 0;

    const goodOrBetterShots = shots.filter((s) =>
      ["Bullseye", "Good"].includes(s.accuracy)
    ).length;

    return Math.round((goodOrBetterShots / shots.length) * 100);
  };

  const accuracyPercentage = calculateAccuracy();

  // Fix voor de Google Cast button in de overlay
  const CastButton = () => {
    return (
      <div className="cast-button-container">
        <button
          id="castBtn"
          className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center"
          onClick={() => {
            // @ts-ignore
            if (window.chrome && window.chrome.cast) {
              // Gebruik de juiste methode om het Cast dialog te tonen
              try {
                // @ts-ignore
                const context =
                  window.chrome.cast.framework.CastContext.getInstance();
                context.requestSession();
              } catch (e) {
                console.error("Error requesting cast session:", e);
                // Fallback naar de legacy API
                // @ts-ignore
                window.chrome.cast.requestSession(
                  (session: any) => {
                    console.log("Cast session started", session);
                  },
                  (err: any) => {
                    console.error("Cast error", err);
                  }
                );
              }
            } else {
              alert(
                "Google Cast niet beschikbaar. Probeer het opnieuw of gebruik de Preview optie."
              );
            }
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="2"
              y1="20"
              x2="2.01"
              y2="20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Gebruik dangerouslySetInnerHTML om de custom element in te voegen */}
        <div
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          dangerouslySetInnerHTML={{
            __html:
              '<google-cast-launcher id="castbutton"></google-cast-launcher>',
          }}
        />
      </div>
    );
  };

  return (
    <div className="h-[calc(100%-120px)] overflow-y-auto no-scrollbar pb-16">
      <div className="p-4">
        {/* Latest Shot Card */}
        {latestShot && (
          <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
            <h2 className="text-lg font-bold mb-3">Laatste Schot</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-400">Snelheid</p>
                <p className="text-xl font-bold text-blue-500">
                  {latestShot.speed} km/h
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Nauwkeurigheid</p>
                <p
                  className={`text-xl font-bold ${
                    latestShot.accuracy === "Bullseye"
                      ? "text-yellow-500"
                      : latestShot.accuracy === "Good"
                      ? "text-green-500"
                      : latestShot.accuracy === "Fair"
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {latestShot.accuracy}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Punten</p>
                <p className="text-xl font-bold text-purple-500">
                  {latestShot.points || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trainingsopties */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-lg font-bold mb-3">Training Starten</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium text-center"
              onClick={() => setShowCastOverlay(true)}
            >
              Vrije Training
            </button>
            <button
              className="bg-zinc-700 text-zinc-400 py-3 px-4 rounded-lg text-sm font-medium relative"
              onClick={() =>
                alert("Premium nodig om deze training te ontgrendelen")
              }
            >
              Precisie Training
              <span className="absolute top-2 right-2">🔒</span>
            </button>
            <button
              className="bg-zinc-700 text-zinc-400 py-3 px-4 rounded-lg text-sm font-medium relative"
              onClick={() =>
                alert("Premium nodig om deze training te ontgrendelen")
              }
            >
              Kracht Training
              <span className="absolute top-2 right-2">🔒</span>
            </button>
            <button
              className="bg-zinc-700 text-zinc-400 py-3 px-4 rounded-lg text-sm font-medium relative"
              onClick={() =>
                alert("Premium nodig om deze training te ontgrendelen")
              }
            >
              Reactie Training
              <span className="absolute top-2 right-2">🔒</span>
            </button>
          </div>
        </div>

        {/* Trainingsstatistieken met correcte precisie */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-lg font-bold mb-3">Trainingsstatistieken</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Gemiddelde snelheid</span>
                <span>
                  {shots.length > 0
                    ? `${Math.round(
                        shots.reduce((sum, shot) => sum + shot.speed, 0) /
                          shots.length
                      )} km/h`
                    : "N/A"}
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((shots.length > 0
                        ? Math.round(
                            shots.reduce((sum, shot) => sum + shot.speed, 0) /
                              shots.length
                          )
                        : 0) /
                        100) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Precisie</span>
                <span>
                  {shots.length > 0 ? `${accuracyPercentage}%` : "N/A"}
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{
                    width: `${accuracyPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Schot geschiedenis */}
        <div className={`${bgColor} rounded-lg p-4 mb-6 shadow-sm`}>
          <h2 className="text-lg font-bold mb-3">Schot Geschiedenis</h2>
          {shots.length > 0 ? (
            <div className="space-y-2">
              {shots
                .slice(-10)
                .reverse()
                .map((shot, index) => (
                  <div
                    key={index}
                    className="border-b border-zinc-700 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Schot {shots.length - index}</p>
                        <p className="text-xs text-zinc-400">
                          {new Date(shot.timestamp).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm ${
                            shot.accuracy === "Bullseye"
                              ? "text-yellow-400"
                              : shot.accuracy === "Good"
                              ? "text-green-400"
                              : shot.accuracy === "Fair"
                              ? "text-orange-400"
                              : "text-red-400"
                          }`}
                        >
                          {shot.accuracy}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {shot.speed} km/h
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 text-center py-4">
              Nog geen schoten geregistreerd
            </p>
          )}
          {shots.length > 10 && (
            <button className="w-full text-center text-xs text-blue-400 mt-3">
              Meer laden...
            </button>
          )}
        </div>
      </div>

      {/* Cast Overlay */}
      {showCastOverlay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              darkMode ? "bg-zinc-800" : "bg-white"
            } rounded-xl p-5 w-full max-w-sm`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Verbind met TV
              </h2>
              <button
                onClick={() => setShowCastOverlay(false)}
                className="text-zinc-400 hover:text-white"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p
              className={`text-sm ${
                darkMode ? "text-zinc-400" : "text-gray-500"
              } mb-5`}
            >
              Cast je training naar een groter scherm voor een betere ervaring.
            </p>

            <div className="bg-zinc-700 rounded-lg p-4 mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Google Cast</p>
                <p className="text-xs text-zinc-400">
                  Verbind met een Chromecast apparaat
                </p>
              </div>
              <CastButton />
            </div>

            <div className="space-y-3">
              <Link
                href="/goalprojector"
                target="_blank"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium w-full block text-center"
              >
                Preview Goalprojector
              </Link>

              <button
                onClick={() => setShowCastOverlay(false)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg text-sm font-medium w-full"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voeg deze Script component toe aan het einde van de return statement */}
      <Script
        id="cast-api-script"
        src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
        onLoad={() => {
          // @ts-ignore
          window.__onGCastApiAvailable = function (isAvailable) {
            if (isAvailable) {
              try {
                // Gebruik de modernere Cast Framework API
                // @ts-ignore
                const context =
                  window.chrome.cast.framework.CastContext.getInstance();
                context.setOptions({
                  receiverApplicationId: "CC1AD845",
                  autoJoinPolicy:
                    window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
                });
              } catch (e) {
                console.error("Error configuring Cast API:", e);
                // Fallback naar legacy API
                // @ts-ignore
                const cast = window.chrome.cast;
                const sessionRequest = new cast.SessionRequest("CC1AD845");
                const apiConfig = new cast.ApiConfig(
                  sessionRequest,
                  (session: any) => console.log("Session started", session),
                  (availability: any) =>
                    console.log("Receiver availability", availability)
                );
                cast.initialize(
                  apiConfig,
                  () => console.log("Cast initialized successfully"),
                  (error: any) =>
                    console.error("Cast initialization error", error)
                );
              }
            }
          };
        }}
      />
    </div>
  );
}
