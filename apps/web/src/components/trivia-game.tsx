"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LiveKitRoom,
  useConnectionState,
  useVoiceAssistant,
  VoiceAssistantControlBar,
  BarVisualizer,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { NoAgentNotification } from "./no-agent-notification";
import useCombinedTranscriptions from "@/hooks/use-combined-transcriptions";
import useLocalMicTrack from "@/hooks/use-local-mic-track";

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

interface TriviaGameProps {
  onStop: () => void;
}

export default function TriviaGame({ onStop }: TriviaGameProps) {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize connection on mount
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      setIsConnecting(true);
      setError(null);

      try {
        const response = await fetch("/api/token");
        if (!response.ok) {
          throw new Error(`Failed to get token: ${response.status}`);
        }

        const details: ConnectionDetails = await response.json();
        if (mounted) {
          setConnectionDetails(details);
        }
      } catch (err) {
        console.error("Failed to initialize connection:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Connection failed");
        }
      } finally {
        if (mounted) {
          setIsConnecting(false);
        }
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
    };
  }, []);

  const handleStop = useCallback(() => {
    setConnectionDetails(null);
    onStop();
  }, [onStop]);

  if (error) {
    return (
      <TriviaGameContainer>
        <div className="text-center p-8">
          <div className="text-red-400 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2">
            Connection Error
          </h3>
          <p className="text-green-400/70 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStop}
            className="border border-red-400 text-red-400 px-6 py-2 rounded font-bold hover:bg-red-400/10 transition-all duration-200"
          >
            &gt; BACK TO MENU
          </motion.button>
        </div>
      </TriviaGameContainer>
    );
  }

  if (isConnecting || !connectionDetails) {
    return (
      <TriviaGameContainer>
        <div className="text-center p-8">
          <div className="animate-spin text-green-400 mb-4 text-2xl">⟳</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">
            Initializing Game...
          </h3>
          <p className="text-green-400/70 mb-4">Setting up voice connection</p>
          <div className="text-amber-400/70 text-sm">
            💡 Make sure to allow microphone access when prompted
          </div>
        </div>
      </TriviaGameContainer>
    );
  }

  return (
    <TriviaGameContainer>
      <LiveKitRoom
        serverUrl={connectionDetails.serverUrl}
        token={connectionDetails.participantToken}
        connect={true}
        audio={true}
        video={false}
        className="h-full"
        onConnected={async () => {
          // Initialize audio context for browser autoplay policies
          try {
            const AudioContextClass =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
            const audioContext = new AudioContextClass();
            if (audioContext.state === "suspended") {
              await audioContext.resume();
            }
          } catch (error) {
            console.warn("Could not initialize audio context:", error);
          }
        }}
      >
        <TriviaGameContent
          onStop={handleStop}
          roomName={connectionDetails.roomName}
        />
      </LiveKitRoom>
    </TriviaGameContainer>
  );
}

function TriviaGameContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-black border border-green-400/30 rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

function TriviaGameContent({
  onStop,
  roomName,
}: {
  onStop: () => void;
  roomName: string;
}) {
  const connectionState = useConnectionState();
  const { state: agentState } = useVoiceAssistant();
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getConnectionStatus = () => {
    switch (connectionState) {
      case ConnectionState.Connecting:
        return {
          status: "CONNECTING",
          color: "text-amber-400",
          indicator: "⟳",
        };
      case ConnectionState.Connected:
        return { status: "CONNECTED", color: "text-green-400", indicator: "●" };
      case ConnectionState.Disconnected:
        return {
          status: "DISCONNECTED",
          color: "text-red-400",
          indicator: "●",
        };
      case ConnectionState.Reconnecting:
        return {
          status: "RECONNECTING",
          color: "text-amber-400",
          indicator: "⟳",
        };
      default:
        return { status: "UNKNOWN", color: "text-gray-400", indicator: "?" };
    }
  };

  const getAgentStatus = () => {
    switch (agentState) {
      case "connecting":
        return { status: "INITIALIZING", color: "text-amber-400" };
      case "listening":
        return { status: "LISTENING", color: "text-green-400" };
      case "thinking":
        return { status: "THINKING", color: "text-blue-400" };
      case "speaking":
        return { status: "SPEAKING", color: "text-purple-400" };
      default:
        return { status: "OFFLINE", color: "text-gray-400" };
    }
  };

  const connectionStatus = getConnectionStatus();
  const agentStatus = getAgentStatus();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-green-400/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-green-400 font-mono">
              &gt; TRIVIA GAME ACTIVE
            </h2>
            <p className="text-green-400/70 text-sm">Room: {roomName}</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Duration */}
            <div className="text-right">
              <div className="text-amber-400 text-sm font-bold">DURATION</div>
              <div className="text-green-400 font-mono">
                {formatDuration(currentTime - startTime)}
              </div>
            </div>

            {/* Connection Status */}
            <div className="text-right">
              <div className="text-amber-400 text-sm font-bold">CONNECTION</div>
              <div
                className={`${connectionStatus.color} font-mono flex items-center gap-1`}
              >
                <span
                  className={
                    connectionStatus.indicator === "⟳" ? "animate-spin" : ""
                  }
                >
                  {connectionStatus.indicator}
                </span>
                {connectionStatus.status}
              </div>
            </div>

            {/* Agent Status */}
            <div className="text-right">
              <div className="text-amber-400 text-sm font-bold">AI AGENT</div>
              <div className={`${agentStatus.color} font-mono`}>
                {agentStatus.status}
              </div>
            </div>

            {/* Stop Button */}
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

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Voice Visualizer */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-amber-400">
              &gt; voice.visualizer
            </h3>
            <div className="bg-black/50 border border-green-400/30 rounded-lg p-6 h-64 flex items-center justify-center">
              <VoiceVisualizer />
            </div>

            <div className="bg-black/50 border border-green-400/30 rounded-lg p-4">
              <VoiceAssistantControlBar />
            </div>
          </div>

          {/* Transcription */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-amber-400">
              &gt; conversation.log
            </h3>
            <div className="bg-black/50 border border-green-400/30 rounded-lg p-4 h-80 overflow-y-auto">
              <TranscriptionView />
            </div>
          </div>
        </div>
      </div>

      {/* Agent notifications */}
      <NoAgentNotification state={agentState} />

      {/* Audio Renderer - Essential for hearing the AI agent */}
      <RoomAudioRenderer />
    </div>
  );
}

function VoiceVisualizer() {
  const micTrackRef = useLocalMicTrack();

  return (
    <div className="agent-visualizer w-full h-full flex items-center justify-center">
      <BarVisualizer
        trackRef={micTrackRef}
        barCount={32}
        options={{
          minHeight: 20,
          maxHeight: 120,
        }}
      />
    </div>
  );
}

function TranscriptionView() {
  const transcriptions = useCombinedTranscriptions();

  return (
    <div className="space-y-3 text-sm font-mono">
      {transcriptions.length === 0 ? (
        <div className="text-green-400/50 italic">
          Waiting for conversation to start...
        </div>
      ) : (
        transcriptions.map((transcription, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 rounded ${
              transcription.role === "assistant"
                ? "bg-blue-400/10 border-l-2 border-blue-400"
                : "bg-green-400/10 border-l-2 border-green-400"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold ${
                  transcription.role === "assistant"
                    ? "text-blue-400"
                    : "text-green-400"
                }`}
              >
                {transcription.role === "assistant" ? "🤖 MIA" : "👤 YOU"}
              </span>
              <span className="text-green-400/50 text-xs">
                {new Date(transcription.firstReceivedTime).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-green-400/90">{transcription.text}</div>
          </motion.div>
        ))
      )}
    </div>
  );
}
