import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useCombinedTranscriptions from "@/hooks/use-combined-transcriptions";
import { UI_CONSTANTS } from "../utils/constants";

export function ConversationSection() {
  const transcriptions = useCombinedTranscriptions();

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 text-lg">💬</span>
        <h3 className="text-lg font-bold text-amber-400">conversation.log</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-green-400/30 to-transparent ml-4"></div>
      </div>

      {/* Chat Card */}
      <div
        className={`bg-gradient-to-br from-black/80 to-blue-900/10 border border-green-400/40 rounded-xl shadow-lg shadow-green-400/10 flex flex-col h-[${UI_CONSTANTS.CHAT_HEIGHT}]`}
      >
        {/* Chat Header */}
        <div className="border-b border-green-400/20 p-4 bg-black/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400/90 text-sm font-mono">
                Live Conversation
              </span>
            </div>
            <div className="text-green-400/60 text-xs font-mono">
              {transcriptions.length} messages
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-h-0">
          <TranscriptionView />
        </div>
      </div>
    </div>
  );
}

function TranscriptionView() {
  const transcriptions = useCombinedTranscriptions();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcriptions arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      // Use requestAnimationFrame to ensure DOM updates are complete
      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [transcriptions]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto p-6 space-y-4 text-sm font-mono scrollbar-thin scrollbar-thumb-green-400/20 scrollbar-track-transparent"
    >
      {transcriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-green-400/30 text-4xl mb-4">💭</div>
          <div className="text-green-400/50 italic">
            Waiting for conversation to start...
          </div>
          <div className="text-green-400/30 text-xs mt-2">
            Say something to begin the trivia game!
          </div>
        </div>
      ) : (
        transcriptions.map((transcription, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative p-4 rounded-xl backdrop-blur-sm ${
              transcription.role === "assistant"
                ? "bg-gradient-to-r from-blue-400/15 to-blue-600/10 border-l-4 border-blue-400 ml-0 mr-8"
                : "bg-gradient-to-r from-green-400/15 to-green-600/10 border-l-4 border-green-400 ml-8 mr-0"
            } shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    transcription.role === "assistant"
                      ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                      : "bg-green-400/20 text-green-400 border border-green-400/30"
                  }`}
                >
                  {transcription.role === "assistant" ? "🤖" : "👤"}
                </div>
                <span
                  className={`text-sm font-bold ${
                    transcription.role === "assistant"
                      ? "text-blue-400"
                      : "text-green-400"
                  }`}
                >
                  {transcription.role === "assistant" ? "MIA" : "YOU"}
                </span>
                {transcription.role === "assistant" && (
                  <span className="text-blue-400/60 text-xs bg-blue-400/10 px-2 py-1 rounded-full">
                    AI Agent
                  </span>
                )}
              </div>
              <span className="text-green-400/40 text-xs font-mono bg-black/30 px-2 py-1 rounded">
                {new Date(transcription.firstReceivedTime).toLocaleTimeString()}
              </span>
            </div>

            {/* Message Content */}
            <div
              className={`leading-relaxed ${
                transcription.role === "assistant"
                  ? "text-blue-100/90"
                  : "text-green-100/90"
              }`}
            >
              {transcription.text}
            </div>

            {/* Subtle glow effect */}
            <div
              className={`absolute inset-0 rounded-xl pointer-events-none ${
                transcription.role === "assistant"
                  ? "shadow-blue-400/5"
                  : "shadow-green-400/5"
              } shadow-2xl`}
            />
          </motion.div>
        ))
      )}
    </div>
  );
}
