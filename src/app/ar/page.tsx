"use client";
import { useEffect, useState } from "react";

export default function ARPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apps.8thwall.com/xrweb?appKey=YOUR_APP_KEY";
    script.async = true;
    script.onload = () => setLoaded(true); // Check if the script loads
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-300">
      {loaded ? (
        <p className="text-green-600">✅ 8th Wall Loaded</p>
      ) : (
        <p className="text-red-600">⏳ Loading 8th Wall...</p>
      )}
    </div>
  );
}
