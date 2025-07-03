"use client"

import Quote from "@/components/quote/quote";
import quotes from "@/data/quotes";
import { useState } from "react";

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(5);

  return (
    <div className="bg-black text-white min-w-screen min-h-screen flex justify-center items-center">
      <Quote quote={quotes[quoteIndex]}/>
    </div>
  );
}
