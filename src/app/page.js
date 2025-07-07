"use client"

import Quote from "@/components/quote/quote";
import QuoteControls from "@/components/quoteControls/quoteControl";
import quotes from "@/data/quotes";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import ShortcutsPopup from "@/components/shortcutsPopup/shortcutsPopup";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [theme, setTheme] = useState("light");

  const nextQuote = useCallback(() => {
    if (quoteIndex + 1 <= quotes.length - 1) {
      setQuoteIndex(quoteIndex + 1);
    } else {
      setQuoteIndex(0);
    }
  }, [quoteIndex]);

  const prevQuote = useCallback(() => {
    if (quoteIndex - 1 >= 0) {
      setQuoteIndex(quoteIndex - 1);
    } else {
      setQuoteIndex(quotes.length - 1);
    }
  }, [quoteIndex]);

  const randomQuote = useCallback(() => {
    setQuoteIndex((prevIndex) => {
      let newIndex = prevIndex;
      while (newIndex === prevIndex && quotes.length > 1) {
        newIndex = Math.floor(Math.random() * quotes.length);
      }
      return newIndex;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight") {
        nextQuote();
      } else if (e.key === "ArrowLeft") {
        prevQuote();
      } else if (e.key.toLowerCase() === "h" ) {
        const tag = document.activeElement?.tagName.toLowerCase();

        if(tag !== "input" && tag !== "textarea"){
          setShowShortcuts((prev) => !prev);
        }
      } else if (e.key.toLowerCase() === "r"){
        const tag = document.activeElement?.tagName.toLowerCase();

        if(tag !== "input" && tag !== "textarea"){
          randomQuote();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextQuote, prevQuote, randomQuote]);

  useEffect(() => {
    document.body.classList.remove("light", "dark", "sunset", "forest", "ocean", "midnight", "red", "yellow");
    document.body.classList.add(theme);
  }, [theme]);


  return (
    <TooltipProvider delayDuration={1000}>
      <div className="min-w-screen min-h-screen flex flex-col justify-center items-center">
        <Quote quote={quotes[quoteIndex]} />
        <QuoteControls
          prevQuote={prevQuote}
          nextQuote={nextQuote}
          setQuoteIndex={setQuoteIndex}
          randomQuote={randomQuote}
          theme={theme}
          setTheme={setTheme}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowShortcuts((prev) => !prev)}
              className="hidden md:flex fixed top-6 right-4 items-center justify-center w-10 h-10 bg-background border border-border text-foreground rounded-full shadow-md z-50 hover:bg-muted transition text-lg"
              aria-label="Toggle Shortcuts"
            >
              ?
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="z-50 animate-slide-down-fade">
            <p>Shortcuts (H)</p>
          </TooltipContent>
        </Tooltip>

        

        {showShortcuts && (
          <ShortcutsPopup onClose={() => setShowShortcuts(false)} />
        )}
      </div>
    </TooltipProvider>
  );
}