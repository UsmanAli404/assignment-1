"use client";

import { useEffect, useRef, useState } from "react";

export default function ShortcutsPopup({ onClose }) {
  const popupRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key) initiateClose();
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
    setTimeout(() => {
      onClose();
    }, 300);
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
          w-full max-w-2xl bg-background text-foreground rounded-lg 
          border border-border shadow-xl p-6 
          transition-transform duration-300 ease-in-out
          ${mounted && !closing ? "scale-100" : "scale-95"}
        `}
      >
        <h3 className="text-xl font-semibold mb-4">Shortcuts</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b pb-3">
            <span>Show Searchbar</span>
            <span className="text-muted-foreground">S</span>
          </li>
          <li className="flex justify-between border-b pb-3">
            <span>Hide Searchbar</span>
            <span className="text-muted-foreground">Esc</span>
          </li>
          <li className="flex justify-between border-b pb-3">
            <span>Previous Quote</span>
            <span className="text-muted-foreground">←</span>
          </li>
          <li className="flex justify-between border-b pb-3">
            <span>Next Quote</span>
            <span className="text-muted-foreground">→</span>
          </li>
          <li className="flex justify-between">
            <span>Random Quote</span>
            <span className="text-muted-foreground">R</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
