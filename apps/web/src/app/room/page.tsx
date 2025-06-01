"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";

import { CloseIcon } from "@/components/close-icon";
import { NoAgentNotification } from "@/components/no-agent-notification";
import TranscriptionView from "@/components/transcription-view";
import MatrixRain from "@/components/shared/matrix-rain";
import TerminalHeader from "@/components/shared/terminal-header";
import ErrorBoundary from "@/components/shared/error-boundary";
import { LAYOUT } from "@/lib/constants";
import type { VoiceAssistantProps, ControlBarProps } from "@/lib/types";
import type { ConnectionDetails } from "../api/token/route";

export default function Page() {
  const [room] = useState(() => new Room());

  const onConnectButtonClicked = useCallback(async () => {
    try {
      const url = new URL(
        process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/token",
        window.location.origin
      );

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(
          `Failed to fetch connection details: ${response.statusText}`
        );
      }

      const connectionDetailsData: ConnectionDetails = await response.json();

      await room.connect(
        connectionDetailsData.serverUrl,
        connectionDetailsData.participantToken
      );
      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (error) {
      console.error("Failed to connect to room:", error);
      // Handle error gracefully - could show a toast notification
    }
  }, [room]);

  useEffect(() => {
    const handleDeviceFailure = (error: Error) => {
      console.error("Device failure:", error);
      alert(
        "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
      );
    };

    room.on(RoomEvent.MediaDevicesError, handleDeviceFailure);
    return () => {
      room.off(RoomEvent.MediaDevicesError, handleDeviceFailure);
    };
  }, [room]);

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
        <MatrixRain />
        <div className="relative z-10">
          <TerminalHeader command="voice-session --active" showBackButton />
          <div className="h-[calc(100vh-80px)] grid content-center">
            <RoomContext.Provider value={room}>
              <div className="max-w-[1024px] w-[90vw] mx-auto max-h-[90vh]">
                <SimpleVoiceAssistant
                  onConnectButtonClicked={onConnectButtonClicked}
                />
              </div>
            </RoomContext.Provider>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}

function SimpleVoiceAssistant({ onConnectButtonClicked }: VoiceAssistantProps) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <AnimatePresence mode="wait">
      {agentState === "disconnected" ? (
        <DisconnectedState onConnectButtonClicked={onConnectButtonClicked} />
      ) : (
        <ConnectedState onConnectButtonClicked={onConnectButtonClicked} />
      )}
    </AnimatePresence>
  );
}

function DisconnectedState({ onConnectButtonClicked }: VoiceAssistantProps) {
  return (
    <motion.div
      key="disconnected"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
      className="grid items-center justify-center h-full"
    >
      <div className="text-center">
        <StatusPanel />
        <ConnectButton onClick={onConnectButtonClicked} />
      </div>
    </motion.div>
  );
}

function StatusPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-black/50 border border-green-400/30 rounded-lg p-6 mb-8"
    >
      <pre className="text-green-400 text-sm text-left">
        {`┌─ VOICE AI TRIVIA READY ─────────────────┐
│                                         │
│  Status: READY FOR CONNECTION           │
│  Agent:  WAITING                        │
│  Audio:  PERMISSION REQUIRED            │
│                                         │
│  Click below to start voice session    │
│                                         │
└─────────────────────────────────────────┘`}
      </pre>
    </motion.div>
  );
}

function ConnectButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
      whileTap={{ scale: 0.95 }}
      className="bg-green-400 text-black px-8 py-3 rounded font-bold text-lg hover:bg-green-300 transition-all duration-200 font-mono"
      onClick={onClick}
    >
      &gt; INITIALIZE CONNECTION
    </motion.button>
  );
}

function ConnectedState({ onConnectButtonClicked }: VoiceAssistantProps) {
  return (
    <motion.div
      key="connected"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
      className="flex flex-col items-center gap-4 h-full"
    >
      <AgentVisualizer />
      <div className="flex-1 w-full">
        <TranscriptionView />
      </div>
      <div className="w-full">
        <ControlBar onConnectButtonClicked={onConnectButtonClicked} />
      </div>
      <RoomAudioRenderer />
      <NoAgentNotification state={useVoiceAssistant().state} />
    </motion.div>
  );
}

function AgentVisualizer() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-lg overflow-hidden border border-green-400/30">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }

  return (
    <div className={`h-[${LAYOUT.AGENT_VISUALIZER_HEIGHT}px] w-full`}>
      <VisualizerHeader agentState={agentState} />
      <BarVisualizer
        state={agentState}
        barCount={7}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function VisualizerHeader({ agentState }: { agentState: string }) {
  return (
    <div className="bg-black/50 border border-green-400/30 rounded-lg p-6 mb-4">
      <div className="text-green-400/70 text-sm mb-2">
        ~/voice-session $ audio-visualizer --realtime
      </div>
      <div className="text-green-400 text-xs mb-4">
        Status: {agentState.toUpperCase()} | Processing: ACTIVE
      </div>
    </div>
  );
}

function ControlBar({ onConnectButtonClicked }: ControlBarProps) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <ReconnectButton onClick={onConnectButtonClicked} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <ActiveControls />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReconnectButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, top: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, top: "-10px" }}
      transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
      className="absolute left-1/2 -translate-x-1/2 bg-green-400 text-black px-6 py-2 rounded font-bold font-mono hover:bg-green-300 transition-all"
      onClick={onClick}
    >
      &gt; RECONNECT
    </motion.button>
  );
}

function ActiveControls() {
  return (
    <motion.div
      initial={{ opacity: 0, top: "10px" }}
      animate={{ opacity: 1, top: 0 }}
      exit={{ opacity: 0, top: "-10px" }}
      transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
      className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center gap-2"
    >
      <div className="bg-black/50 border border-green-400/30 rounded px-4 py-1 flex items-center gap-2">
        <VoiceAssistantControlBar controls={{ leave: false }} />
        <DisconnectButton>
          <CloseIcon />
        </DisconnectButton>
      </div>
    </motion.div>
  );
}
