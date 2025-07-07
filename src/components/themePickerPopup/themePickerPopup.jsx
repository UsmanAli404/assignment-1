"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

const themes = [
  { name: "light", color: "bg-white" },
  { name: "dark", color: "bg-neutral-800" },
  { name: "sunset", color: "bg-orange-400" },
  { name: "forest", color: "bg-green-500" },
  { name: "ocean", color: "bg-blue-500" },
  { name: "midnight", color: "bg-indigo-900" },
  { name: "red", color: "bg-red-500"},
  { name: "yellow", color: "bg-yellow-400"},
];

export default function ThemePickerPopup({ onClose, currentTheme, onThemeSelect }) {
  const popupRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") initiateClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        initiateClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initiateClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/30 backdrop-blur-sm px-4 
        transition-opacity duration-300 ease-in-out
        ${mounted && !closing ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        ref={popupRef}
        className={`
          relative w-full max-w-sm bg-background text-foreground rounded-lg 
          border border-border shadow-xl p-6 
          transition-transform duration-300 ease-in-out
          ${mounted && !closing ? "scale-100" : "scale-95"}
        `}
      >
        <button
          onClick={initiateClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1 border transition"
          aria-label="Close theme picker"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold mb-4">Select Theme</h3>
        <div className="grid grid-cols-4 gap-4 content-center items-center md:gap-y-8">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className={`relative w-12 h-12 rounded-sm cursor-pointer border-2 transition-all place-self-center
                ${theme.color} 
                ${currentTheme === theme.name ? "ring-2 ring-ring" : "hover:opacity-80"}`}
              onClick={() => {
                onThemeSelect(theme.name);
              }}
            >
              {currentTheme === theme.name && (
                <Check className="absolute inset-0 m-auto text-foreground w-4 h-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
