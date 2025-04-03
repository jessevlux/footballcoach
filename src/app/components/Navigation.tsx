"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SettingsTab from "./SettingsTab";

export default function Navigation() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  // Vervang de sensor-pagina door vrienden in de navigatie
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Football", path: "/football" },
    { name: "Friends", path: "/friends" }, // Nieuwe vrienden pagina
    { name: "Community", path: "/community" },
    { name: "Settings", icon: "⚙️", action: () => setShowSettings(true) },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center py-2 px-4 ${
                  pathname === item.path ? "text-blue-400" : "text-zinc-400"
                }`}
              >
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.action}
                className="flex flex-col items-center py-2 px-4 text-zinc-400"
              >
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            )
          )}
        </div>
      </nav>

      {/* Settings overlay */}
      {showSettings && <SettingsTab onClose={() => setShowSettings(false)} />}
    </>
  );
}
