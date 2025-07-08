"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddQuotePopup({ onClose, onSubmit }) {
  const popupRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [topic, setTopic] = useState("");

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

  const handleSubmit = () => {
    if (quote.trim() && author.trim()) {
        onSubmit({
            text: quote.trim(),
            author: author.trim(),
            tags: [...new Set(
                topic
                .split(",")
                .map(t => t.trim().toLowerCase())
                .filter(t => t.length > 0)
            )],
        });
        initiateClose();
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
          relative w-full max-w-md bg-background text-foreground rounded-lg 
          border border-border shadow-xl p-6 space-y-4
          transition-transform duration-300 ease-in-out
          ${mounted && !closing ? "scale-100" : "scale-95"}
        `}
      >
        <button
          onClick={initiateClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1 border transition"
          aria-label="Close quote form"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold">Add a New Quote</h3>

        <Textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Enter quote text"
          className="resize-none overflow-y-auto max-h-32"
          rows={3}
        />

        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
        />

        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="One or more comma-separated Topic(s)"
        />

        <div className="flex">
          <Button className={`w-full`} onClick={handleSubmit} disabled={!quote.trim() || !author.trim() || !topic.trim()}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}