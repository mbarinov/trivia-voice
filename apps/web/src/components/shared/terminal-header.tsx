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
      className="p-4 border-b border-green-400/30 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <Link
              href="/"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              ← root@trivia-ai:~$
            </Link>
          ) : (
            <span className="text-amber-400">root@trivia-ai:~$</span>
          )}
          <span className="text-green-400">{command}</span>
        </div>
        <div className="text-green-400/70 text-sm">
          {showBackButton ? currentTime : `System Time: ${currentTime}`}
        </div>
      </div>
    </motion.header>
  );
}
