import { useEffect, useRef, useState } from "react";
import { Search, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export default function SearchBar({ onClose, onSelectQuote, setShowAddQuote, quotes }) {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilterOptions, setShowFilterOptions] = useState(false);


  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 10);
    inputRef.current?.focus();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdown = document.querySelector("[data-radix-popper-content-wrapper]");
      const isInsideDropdown = dropdown?.contains(e.target);

      if (!containerRef.current?.contains(e.target) && !isInsideDropdown) {
        setClosing(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (closing) {
      const timeout = setTimeout(onClose, 300);
      return () => clearTimeout(timeout);
    }
  }, [closing, onClose]);

  const filtered = quotes
  .map((q, i) => ({ ...q, index: i }))
  .filter((q) => {
    const qLower = query.toLowerCase();

    const safeTags = Array.isArray(q.tags) ? q.tags : [];

    if (filterBy === "all") {
      return (
        q.text.toLowerCase().includes(qLower) ||
        q.author.toLowerCase().includes(qLower) ||
        safeTags.some(tag => tag?.toLowerCase().includes(qLower))
      );
    }

    if (filterBy === "author") {
      return q.author.toLowerCase().includes(qLower);
    }

    if (filterBy === "topic") {
      return safeTags.some(tag => tag?.toLowerCase().includes(qLower))
    }

    return false;
  });

  const isFilterDisabled = query.trim() !== "";

  return (
    <>
    {query.trim() && (
      <div className="fixed inset-0 z-[52] backdrop-blur-sm transition duration-200 bg-black/10" />
    )}

    <div
      ref={containerRef}
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 w-[80%] max-w-lg z-[55]
        transition-all duration-300 ease-in-out backdrop-blur-sm
        ${mounted && !closing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
      `}
    >
      <div className="flex items-center bg-background text-foreground border border-border rounded-full px-4 py-2 shadow-md relative">
        <Search className="size-5 mr-2 text-muted-foreground" />

        <input
          ref={inputRef}
          type="text"
          placeholder={`Search quotes${filterBy === "all" ? "..." : ` by ${filterBy}...`}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-base"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 p-1 rounded-full text-muted-foreground hover:text-foreground"
              title="Filter"
              disabled={isFilterDisabled}
            >
              <Filter className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className={`mt-4`}>
            <DropdownMenuItem
              onClick={() => setFilterBy("all")}
              className={filterBy === "all" ? "font-medium bg-muted/50" : ""}
            >
              Search All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterBy("author")}
              className={filterBy === "author" ? "font-medium bg-muted/50" : ""}
            >
              Search by Author
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterBy("topic")}
              className={filterBy === "topic" ? "font-medium bg-muted/50" : ""}
            >
              Search by Topic
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      {query.trim() && filtered.length > 0 && (
        <ScrollArea className="mt-2 h-60 rounded-lg border border-border bg-background shadow-md">
          <div className="space-y-1 px-2 py-2">
            {filtered.map((quote) => (
              <button
                key={quote.index}
                onClick={() => {
                  onSelectQuote(quote.index);
                  setClosing(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              >
                <p className="text-sm text-foreground line-clamp-2">{quote.text}</p>
                <p className="text-xs text-muted-foreground mt-1">– {quote.author}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      {query.trim() && filtered.length === 0 && (
        <div className="mt-2 p-4 text-sm text-muted-foreground bg-background border border-border rounded-lg shadow-sm space-y-4">
          <p>No quotes found.</p>

          <div className="border-t border-border pt-4 space-y-2">
            <h4 className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
              Add a Quote
            </h4>
            <Button
              variant=""
              onClick={() => {
                onClose();
                setTimeout(() => setShowAddQuote(true), 100);
              }}
              className="mt-2 w-full text-2xl"
            >
              +
            </Button>
          </div>
        </div>
      )}

    </div>
    </>
  );
}