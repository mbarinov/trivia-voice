"use client";

import { useState, useEffect, useCallback } from "react";
import { ANIMATIONS } from "@/lib/constants";
import type { TypewriterProps } from "@/lib/types";

export default function TypewriterText({
  text,
  className = "",
  delay = ANIMATIONS.TYPEWRITER_DEFAULT_DELAY,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const resetAnimation = useCallback(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    resetAnimation();
  }, [text, resetAnimation]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      setIsComplete(true);
      return;
    }

    const initialDelay = delay * 1000;
    const characterDelay = ANIMATIONS.TYPEWRITER_DELAY;
    const totalDelay = currentIndex === 0 ? initialDelay : characterDelay;

    const timer = setTimeout(() => {
      setDisplayText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">_</span>}
    </span>
  );
}
