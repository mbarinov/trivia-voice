import { motion } from "framer-motion";
import { StatusIndicator } from "./StatusIndicator";
import { formatDuration } from "../utils/formatters";

interface GameHeaderProps {
  roomName: string;
  duration: number;
  connectionStatus: {
    status: string;
    color: string;
    indicator: string;
  };
  agentStatus: {
    status: string;
    color: string;
  };
  onStop: () => void;
}

export function GameHeader({
  roomName,
  duration,
  connectionStatus,
  agentStatus,
  onStop,
}: GameHeaderProps) {
  return (
    <div className="border-b border-green-400/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-green-400 font-mono">
            &gt; TRIVIA GAME ACTIVE
          </h2>
          <p className="text-green-400/70 text-sm">Room: {roomName}</p>
        </div>

        <div className="flex items-center gap-6">
          <StatusIndicator
            label="DURATION"
            status={formatDuration(duration)}
            color="text-green-400"
          />

          <StatusIndicator
            label="CONNECTION"
            status={connectionStatus.status}
            color={connectionStatus.color}
            indicator={connectionStatus.indicator}
            animated={connectionStatus.indicator === "⟳"}
          />

          <StatusIndicator
            label="AI AGENT"
            status={agentStatus.status}
            color={agentStatus.color}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold text-sm transition-colors"
          >
            STOP GAME
          </motion.button>
        </div>
      </div>
    </div>
  );
}
