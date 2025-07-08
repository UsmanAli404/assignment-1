"use client";

import { useEffect, useRef, useState } from "react";
import { X, Play, Pause } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const tracks = [
  { name: "Emotional violin", src: "/music/emotional-inspiring-violin-342019.mp3" },
  { name: "Inspiring Violin", src: "/music/inspiring-violin-music-background-300812.mp3" },
  { name: "Magical Moments", src: "/music/Magical-Moments-chosic.com_.mp3" },
  { name: "Spring Flowers", src: "/music/Spring-Flowers(chosic.com).mp3" },
  { name: "Warm Memories", src: "/music/Warm-Memories-Emotional-Inspiring-Piano(chosic.com).mp3" },
  { name: "Emotional Ethnic Music", src: "/music/Yugen-Emotional-Ethnic-Music(chosic.com).mp3" },
];

export default function MusicPickerPopup({ onClose, currentTrack, onTrackSelect, audioRef }) {
  const popupRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [playingTrack, setPlayingTrack] = useState(currentTrack);
  const [isPlaying, setIsPlaying] = useState(true);

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

  useEffect(() => {
    if (!audioRef.current) return;

    const currentSrc = audioRef.current.src;
    const matched = tracks.find(t => currentSrc.includes(t.src));

    if (matched) {
        setPlayingTrack(matched.name);
        setIsPlaying(!audioRef.current.paused);
    }
  }, []);

  const toggleTrack = (track) => {
    if (!audioRef.current) return;

    const isSameTrack = playingTrack === track.name;

    if (isSameTrack) {
        if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
        } else {
        audioRef.current.pause();
        setIsPlaying(false);
        }
    } else {
        audioRef.current.src = track.src;
        audioRef.current.play().catch(console.error);
        setPlayingTrack(track.name);
        setIsPlaying(true);
        onTrackSelect(track.name);
    }
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
          aria-label="Close music picker"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold mb-4">Select Music</h3>

        <ScrollArea className="h-64 pr-2">
            <div className="flex flex-col gap-3 pl-1 pr-3 py-1">
                {tracks.map((track) => (
                <div
                    key={track.name}
                    className={`flex items-center justify-between px-4 py-2 rounded-md cursor-pointer border transition-all hover:bg-accent/30 ${
                    currentTrack === track.name ? "bg-accent/20 ring-1 ring-ring" : ""
                    }`}
                    onClick={() => toggleTrack(track)}
                >
                    <div className="flex items-center gap-2">
                    {isPlaying && playingTrack === track.name ? (
                        <Pause className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <Play className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{track.name}</span>
                    </div>
                </div>
                ))}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}