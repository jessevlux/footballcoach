"use client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { useData } from "./DataContext";
import Link from "next/link";

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

export default function FootballTab() {
  const { darkMode } = useTheme();
  const { shots, latestShot, addShot } = useData();
  const [localShots, setLocalShots] = useState(shots);
  const [isCasting, setIsCasting] = useState(false);
  const [castAvailable, setCastAvailable] = useState(false);
  const castSession = useRef<any>(null);
  const castContext = useRef<any>(null);

  // Update localShots wanneer shots verandert
  useEffect(() => {
    setLocalShots([...shots]);
  }, [shots]);

  // Initialiseer Google Cast
  useEffect(() => {
    console.log(
      "Chrome cast beschikbaar?",
      window.chrome && window.chrome.cast && window.chrome.cast.isAvailable
    );

    // Wacht tot de Cast API beschikbaar is
    window["__onGCastApiAvailable"] = (isAvailable: boolean) => {
      console.log("__onGCastApiAvailable callback:", isAvailable);
      if (isAvailable) {
        initializeCastApi();
      }
    };

    // Controleer of de Cast API al beschikbaar is
    if (window.chrome && window.chrome.cast && window.chrome.cast.isAvailable) {
      console.log("Cast API is direct beschikbaar");
      initializeCastApi();
    }

    return () => {
      // Cleanup
      window["__onGCastApiAvailable"] = null;
    };
  }, []);

  // Initialiseer de Cast API
  const initializeCastApi = () => {
    try {
      console.log("Initialiseren van Cast API...");

      // Gebruik de standaard receiver app ID
      const applicationID = "CC1AD845";

      // Initialiseer de sessie request
      const sessionRequest = new window.chrome.cast.SessionRequest(
        applicationID
      );

      // Initialiseer de API config
      const apiConfig = new window.chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener
      );

      // Initialiseer de Cast API
      window.chrome.cast.initialize(apiConfig, onInitSuccess, onError);
    } catch (error) {
      console.error("Error initializing Cast API:", error);
      setCastAvailable(false);
    }
  };

  // Callback functies
  const sessionListener = (session: any) => {
    console.log("Nieuwe sessie:", session);
    castSession.current = session;
    setIsCasting(true);
  };

  const receiverListener = (availability: string) => {
    console.log("Receiver beschikbaarheid:", availability);
    if (availability === "available") {
      setCastAvailable(true);
    } else {
      setCastAvailable(false);
    }
  };

  const onInitSuccess = () => {
    console.log("Cast API succesvol geïnitialiseerd");
    setCastAvailable(true);
  };

  const onError = (error: any) => {
    console.error("Cast API initialisatie fout:", error);
    setCastAvailable(false);
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

  return (
    <div className="p-4 h-[calc(100%-120px)] overflow-y-auto no-scrollbar">
      <div
        className={`p-4 rounded-lg mb-4 ${
          darkMode ? "bg-zinc-800" : "bg-gray-100"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Goal Projector
          </h3>

          {/* Cast Button */}
          <button
            onClick={() => {
              if (window.chrome && window.chrome.cast) {
                // Gebruik de standaard media receiver
                const applicationID = "CC1AD845";

                window.chrome.cast.requestSession(
                  (session) => {
                    console.log("Cast sessie gestart:", session);
                    castSession.current = session;
                    setIsCasting(true);

                    // Cast een video
                    const mediaInfo = new window.chrome.cast.media.MediaInfo(
                      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                      "video/mp4"
                    );

                    // Voeg metadata toe voor een betere weergave
                    const metadata =
                      new window.chrome.cast.media.GenericMediaMetadata();
                    metadata.title = "Football Goal";
                    metadata.subtitle = "Football Coach App";
                    mediaInfo.metadata = metadata;

                    const request = new window.chrome.cast.media.LoadRequest(
                      mediaInfo
                    );
                    session.loadMedia(
                      request,
                      (mediaSession) => {
                        console.log("Media geladen:", mediaSession);
                        if (!castSession.current.media) {
                          castSession.current.media = [];
                        }
                        castSession.current.media[0] = mediaSession;
                      },
                      (error) => {
                        console.error("Media laden mislukt:", error);
                      }
                    );
                  },
                  (error) => {
                    console.error("Cast sessie fout:", error);
                  }
                );
              }
            }}
            className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${
              castAvailable
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            disabled={!castAvailable}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="3" cy="20" r="1" fill="currentColor" />
            </svg>
            Cast to Display
          </button>
        </div>

        {isCasting ? (
          <div className="space-y-4">
            <p className="text-green-400 text-sm">
              ✓ Currently casting to display
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={changeTarget}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Change Target
              </button>
              <button
                onClick={takeShot}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              >
                Take Shot
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p
              className={`text-sm mb-3 ${
                darkMode ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              Cast to a display to start training
            </p>
            <Link
              href="/goalprojector"
              className={`px-3 py-1 rounded text-sm ${
                darkMode ? "bg-zinc-700" : "bg-gray-200"
              } text-center inline-block`}
            >
              Preview Goal Projector
            </Link>
          </div>
        )}
      </div>

      {/* Shot History */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-zinc-800" : "bg-gray-100"}`}
      >
        <h3
          className={`font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Shot History ({localShots.length})
        </h3>

        {localShots.length > 0 ? (
          <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
            {localShots
              .slice()
              .reverse()
              .map((shot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-zinc-700" : "bg-white"
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        shot.points > 0 ? "bg-green-500" : "bg-orange-500"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {shot.points > 0 ? `${shot.points} Points` : "Missed"}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-zinc-400" : "text-gray-500"
                        }`}
                      >
                        {shot.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs ${
                        shot.accuracy === "Bullseye"
                          ? "text-yellow-500"
                          : shot.accuracy === "Excellent"
                          ? "text-green-500"
                          : shot.accuracy === "Good"
                          ? "text-blue-500"
                          : shot.accuracy === "Fair"
                          ? "text-orange-500"
                          : "text-red-500"
                      }`}
                    >
                      {shot.accuracy}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      {shot.speed} km/h
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p
            className={`text-sm ${
              darkMode ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            No shots recorded yet
          </p>
        )}
      </div>
    </div>
  );
}
