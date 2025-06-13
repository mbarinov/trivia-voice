"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrentTime } from "@/lib/utils";

interface TerminalHeaderProps {
  command?: string;
  showBackButton?: boolean;
}

export default function TerminalHeader({
  command = "whoami",
  showBackButton = false,
}: TerminalHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatCurrentTime());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-2 sm:py-4 px-3 sm:px-4 border-b border-green-400/30 backdrop-blur-sm bg-black/70 shadow-md"
    >
      <div className="max-w-6xl mx-auto flex flex-row justify-between items-center w-full overflow-x-auto whitespace-nowrap gap-2">
        <div className="flex items-center gap-1 sm:gap-4 min-w-0">
          {showBackButton ? (
            <Link
              href="/"
              className="text-amber-400 hover:text-amber-300 transition-colors text-sm sm:text-lg truncate"
            >
              ← root@trivia-ai:~$
            </Link>
          ) : (
            <span className="text-amber-400 text-sm sm:text-lg truncate">
              root@trivia-ai:~$
            </span>
          )}
          <span className="text-green-400 text-sm sm:text-lg truncate">
            {command}
          </span>
        </div>
        <div className="text-green-400/70 text-xs sm:text-sm truncate text-right min-w-fit ml-2">
          {showBackButton ? (
            currentTime
          ) : (
            <>
              <span className="hidden sm:inline">System Time: </span>
              {currentTime}
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
