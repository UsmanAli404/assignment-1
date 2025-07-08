"use client"

import Quote from "@/components/quote/quote";
import QuoteControls from "@/components/quoteControls/quoteControl";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import ShortcutsPopup from "@/components/shortcutsPopup/shortcutsPopup";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

const defaultQuotes = [
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    tags: ["philosophy", "wisdom", "self-awareness"]
  },
  {
    text: "Imagination is more important than knowledge.",
    author: "Albert Einstein",
    tags: ["creativity", "science", "knowledge"]
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    tags: ["motivation", "adversity", "growth"]
  },
  {
    text: "Happiness depends upon ourselves.",
    author: "Aristotle",
    tags: ["happiness", "self-reliance", "philosophy"]
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    tags: ["individuality", "confidence", "life"]
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (on Aristotle)",
    tags: ["discipline", "habit", "excellence"]
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    tags: ["philosophy", "self-reflection", "life"]
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    tags: ["individualism", "leadership", "inspiration"]
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    tags: ["resilience", "courage", "success"]
  },
  {
    text: "I think, therefore I am.",
    author: "René Descartes",
    tags: ["existence", "philosophy", "thinking"]
  },
  {
    text: "He who opens a school door, closes a prison.",
    author: "Victor Hugo",
    tags: ["education", "freedom", "society"]
  },
  {
    text: "You must be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
    tags: ["change", "action", "inspiration"]
  },
  {
    text: "The future belongs to those who prepare for it today.",
    author: "Malcolm X",
    tags: ["future", "preparation", "activism"]
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    tags: ["perseverance", "motivation", "growth"]
  },
  {
    text: "Art is the lie that enables us to realize the truth.",
    author: "Pablo Picasso",
    tags: ["art", "truth", "creativity"]
  }
];

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [theme, setTheme] = useState("light");
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const savedQuotes = localStorage.getItem("quotes");
    if (savedQuotes) {
      setQuotes(JSON.parse(savedQuotes));
    } else {
      setQuotes(defaultQuotes);
      localStorage.setItem("quotes", JSON.stringify(defaultQuotes));
    }
  }, []);

  function addQuote(newQuote) {
    setQuotes(prev => {
      const updated = [...prev, newQuote];
      localStorage.setItem("quotes", JSON.stringify(updated));
      return updated;
    });
  }

  const nextQuote = useCallback(() => {
    if (quoteIndex + 1 <= quotes.length - 1) {
      setQuoteIndex(quoteIndex + 1);
    } else {
      setQuoteIndex(0);
    }
  }, [quoteIndex, quotes]);

  const prevQuote = useCallback(() => {
    if (quoteIndex - 1 >= 0) {
      setQuoteIndex(quoteIndex - 1);
    } else {
      setQuoteIndex(quotes.length - 1);
    }
  }, [quoteIndex, quotes]);

  const randomQuote = useCallback(() => {
    setQuoteIndex((prevIndex) => {
      let newIndex = prevIndex;
      while (newIndex === prevIndex && quotes.length > 1) {
        newIndex = Math.floor(Math.random() * quotes.length);
      }
      return newIndex;
    });
  }, [quotes]);

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
          quotes={quotes}
          addQuote={addQuote}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowShortcuts((prev) => !prev)}
              className="hidden md:flex fixed top-6 right-4 items-center justify-center w-10 h-10 bg-background border border-border text-foreground rounded-full shadow-md z-40 hover:bg-muted transition text-lg"
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