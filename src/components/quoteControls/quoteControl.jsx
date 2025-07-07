"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, ChevronRight, Shuffle, Music2 } from "lucide-react";
import SearchBar from "@/components/searchBar/searchBar";
import { useState, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect } from "react";
import ThemePickerPopup from "../themePickerPopup/themePickerPopup";
import useIsDesktop from "@/utils/useIsDesktop";
import MusicPickerPopup from "../musicPicker/musicPickerPopup";

export default function QuoteControls({ prevQuote, nextQuote, setQuoteIndex, randomQuote, theme, setTheme }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);
    const isDesktop = useIsDesktop();
    const [showMusicPicker, setShowMusicPicker] = useState(false);
    const [currentTrack, setCurrentTrack] = useState("Calm Breeze");
    const audioRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName.toLowerCase();

            if (e.key.toLowerCase() === "s" && tag !== "input" && tag !== "textarea") {
                e.preventDefault();
                setShowSearch(true);
            } else if (e.key === "Escape" && showSearch) {
                setShowSearch(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showSearch]);

    return (
        <>
            {showSearch && <SearchBar onClose={() => setShowSearch(false)} onSelectQuote={(index)=>{setQuoteIndex(index); setShowSearch(false)}} />}
            {showThemePicker && <ThemePickerPopup currentTheme={theme} onThemeSelect={setTheme} onClose={() => setShowThemePicker(false)} />}
            {showMusicPicker && (
                <MusicPickerPopup
                    onClose={() => setShowMusicPicker(false)}
                    currentTrack={currentTrack}
                    onTrackSelect={(trackName) => setCurrentTrack(trackName)}
                    audioRef={audioRef}
                />
            )}
            <audio ref={audioRef} hidden preload="auto" />

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 shadow-md bg-background py-[5px] px-[5px] rounded-full border border-border z-40">

                {isDesktop ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => setShowThemePicker(true)} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="z-50">
                    <p>Select Theme</p>
                    </TooltipContent>
                </Tooltip>
                ) : (
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setShowThemePicker(true)} />
                )}

                {isDesktop ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={prevQuote}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="z-50">
                    <p>Previous Quote (←)</p>
                    </TooltipContent>
                </Tooltip>
                ) : (
                <Button variant="ghost" size="icon" className="rounded-full" onClick={prevQuote}>
                    <ChevronLeft className="size-4" />
                </Button>
                )}

                {isDesktop ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowSearch(true)}>
                        <Search className="size-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="z-50">
                    <p>Search Quotes (S)</p>
                    </TooltipContent>
                </Tooltip>
                ) : (
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowSearch(true)}>
                    <Search className="size-4" />
                </Button>
                )}

                {isDesktop ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={nextQuote}>
                        <ChevronRight className="size-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                    <p>Next Quote (→)</p>
                    </TooltipContent>
                </Tooltip>
                ) : (
                <Button variant="ghost" size="icon" className="rounded-full" onClick={nextQuote}>
                    <ChevronRight className="size-4" />
                </Button>
                )}

                {isDesktop ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={randomQuote}>
                        <Shuffle className="size-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                    <p>Random Quote (R)</p>
                    </TooltipContent>
                </Tooltip>
                ) : (
                <Button variant="ghost" size="icon" className="rounded-full" onClick={randomQuote}>
                    <Shuffle className="size-4" />
                </Button>
                )}

                {isDesktop ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={()=>setShowMusicPicker(true)}
                        >
                            <Music2 className="size-4" />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                        <p>Select Music</p>
                        </TooltipContent>
                    </Tooltip>
                    ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={()=>setShowMusicPicker(true)}
                    >
                        <Music2 className="size-4" />
                    </Button>
                )}
            </div>
        </>
    );
}