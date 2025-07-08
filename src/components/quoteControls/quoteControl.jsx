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
import AddQuotePopup from "../addQuotePopup/addQuotePopup";

export default function QuoteControls({ quotes, prevQuote, nextQuote, setQuoteIndex, randomQuote, theme, setTheme, addQuote }) {
    const [showSearch, setShowSearch] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);
    const isDesktop = useIsDesktop();
    const [showMusicPicker, setShowMusicPicker] = useState(false);
    const [currentTrack, setCurrentTrack] = useState("Emotional Ethnic Music");
    const audioRef = useRef(null);
    const [showAddQuote, setShowAddQuote] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = document.activeElement?.tagName.toLowerCase();

            if (e.key.toLowerCase() === "s" && tag !== "input" && tag !== "textarea") {
                e.preventDefault();
                setShowSearch(true);
            } else if (e.key.toLowerCase() === "t" && tag !== "input" && tag !== "textarea") {
                e.preventDefault();
                setShowThemePicker(true);
            } else if (e.key.toLowerCase() === "m" && tag !== "input" && tag !== "textarea") {
                e.preventDefault();
                setShowMusicPicker(true);
            } else if (e.key === "Escape") {
                if (showSearch) setShowSearch(false);
                if (showMusicPicker) setShowMusicPicker(false);
                if (showThemePicker) setShowThemePicker(false);
                if (showAddQuote) setShowAddQuote(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showSearch, showMusicPicker, showThemePicker, showAddQuote]);

    useEffect(() => {
        if (!audioRef.current) return;

        const defaultTrack = "/music/Yugen-Emotional-Ethnic-Music(chosic.com).mp3";
        const isAlreadySet = audioRef.current.src?.includes(defaultTrack);

        if (!isAlreadySet) {
            audioRef.current.src = defaultTrack;

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    console.warn("Autoplay failed:", err.message);
                });
            }
        }
    }, []);

    return (
        <>
            {showSearch && <SearchBar quotes={quotes} onClose={() => setShowSearch(false)} onSelectQuote={(index)=>{setQuoteIndex(index); setShowSearch(false)}} setShowAddQuote={setShowAddQuote} />}
            {showThemePicker && <ThemePickerPopup currentTheme={theme} onThemeSelect={setTheme} onClose={() => setShowThemePicker(false)} />}
            {showMusicPicker && (
                <MusicPickerPopup
                    onClose={() => setShowMusicPicker(false)}
                    currentTrack={currentTrack}
                    onTrackSelect={(trackName) => setCurrentTrack(trackName)}
                    audioRef={audioRef}
                />
            )}
            <audio ref={audioRef} hidden preload="auto" loop/>
            {showAddQuote && (
                <AddQuotePopup
                onClose={() => setShowAddQuote(false)}
                onSubmit={(newQuote) => {
                    addQuote(newQuote);
                }}
                />
            )}

            <div className="fixed bottom-7 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 shadow-md bg-background py-[5px] px-[5px] rounded-full border border-border z-40">

                {isDesktop ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => setShowThemePicker(true)} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="z-50">
                    <p>Select Theme (T)</p>
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
                            variant={`${audioRef.current?.paused ? "ghost" : "outline"}`}
                            size="icon"
                            className="rounded-full relative"
                            onClick={()=>setShowMusicPicker(true)}
                        >
                            <Music2
                                className={`
                                size-4 transition-transform 
                                ${audioRef.current?.paused ? "" : "animate-spin"}
                                `}
                                style={{
                                animationDuration: "6s",
                                animationTimingFunction: "linear",
                                }}
                            />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                        <p>Select Music (M)</p>
                        </TooltipContent>
                    </Tooltip>
                    ) : (
                    <Button
                        variant={`${audioRef.current?.paused ? "ghost" : "outline"}`}
                        size="icon"
                        className="rounded-full"
                        onClick={()=>setShowMusicPicker(true)}
                    >
                        <Music2
                            className={`
                            size-4 transition-transform 
                            ${audioRef.current?.paused ? "" : "animate-spin"}
                            `}
                            style={{
                            animationDuration: "6s",
                            animationTimingFunction: "linear",
                            }}
                        />
                    </Button>
                )}
            </div>
        </>
    );
}