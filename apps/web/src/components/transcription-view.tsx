"use client";

import { useTranscription } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useMemo } from "react";
import { scrollToBottom } from "@/lib/utils";
import { LAYOUT, ANIMATIONS } from "@/lib/constants";

export default function TranscriptionView() {
  const { segments } = useTranscription();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new segments arrive
  useEffect(() => {
    scrollToBottom(scrollRef.current);
  }, [segments]);

  // Memoize segments to prevent unnecessary re-renders
  const memoizedSegments = useMemo(() => segments, [segments]);

  return (
    <div
      className={`bg-black/70 border border-green-400/30 rounded-lg p-4 h-[${LAYOUT.TRANSCRIPTION_HEIGHT}px] overflow-hidden`}
    >
      <TerminalHeader segmentCount={memoizedSegments.length} />
      <ScrollableContent ref={scrollRef} segments={memoizedSegments} />
      <StatusFooter segmentCount={memoizedSegments.length} />
    </div>
  );
}

function TerminalHeader({ segmentCount }: { segmentCount: number }) {
  return (
    <div className="text-green-400/70 text-sm mb-2 font-mono">
      ~/voice-session $ tail -f transcription.log ({segmentCount} lines)
    </div>
  );
}

interface ScrollableContentProps {
  segments: Array<{
    id?: string;
    text: string;
    final?: boolean;
    participant: {
      identity: string;
    };
  }>;
}

const ScrollableContent = ({ segments }: ScrollableContentProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="h-[250px] overflow-y-auto space-y-2 font-mono text-sm"
    >
      <AnimatePresence>
        {segments.length > 0 ? (
          segments.map((segment, index) => (
            <TranscriptionSegment
              key={segment.id || `segment-${index}`}
              segment={segment}
              index={index}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
};

interface TranscriptionSegmentProps {
  segment: {
    id?: string;
    text: string;
    final?: boolean;
    participant: {
      identity: string;
    };
  };
  index: number;
}

function TranscriptionSegment({ segment, index }: TranscriptionSegmentProps) {
  const isAgent = segment.participant.identity === "agent";
  const participantLabel = isAgent ? "AI>" : "USER>";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: ANIMATIONS.TRANSCRIPTION_ANIMATION_DURATION }}
      className="border-b border-green-400/10 pb-2 last:border-b-0"
    >
      <div className="flex items-start gap-2">
        <span className="text-amber-400 text-xs font-bold min-w-[60px] flex-shrink-0">
          {participantLabel}
        </span>
        <span className="text-green-400 leading-relaxed break-words">
          {segment.text}
          {!segment.final && (
            <span className="animate-pulse text-green-400/50 ml-1">...</span>
          )}
        </span>
      </div>
      {segment.final && (
        <div className="text-green-400/50 text-xs mt-1 ml-16">
          [FINAL] {new Date().toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="text-green-400/50 text-center py-8">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Waiting for voice input...
        <span className="animate-pulse">_</span>
      </motion.div>
    </div>
  );
}

function StatusFooter({ segmentCount }: { segmentCount: number }) {
  return (
    <div className="text-green-400/50 text-xs mt-2 flex justify-between">
      <span>Segments: {segmentCount}</span>
      <span>Status: ACTIVE</span>
    </div>
  );
}
