import { useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { NoAgentNotification } from "../../no-agent-notification";
import { GameHeader } from "./GameHeader";
import { VoiceSection } from "./VoiceSection";
import { useGameTimer } from "../hooks/useGameTimer";
import { useGameStatus } from "../hooks/useGameStatus";
import { ConnectionDetails } from "../hooks/useConnectionManager";

interface TriviaGameContentProps {
  connectionDetails: ConnectionDetails;
  onStop: () => void;
}

export function TriviaGameContent({
  connectionDetails,
  onStop,
}: TriviaGameContentProps) {
  const handleConnected = useCallback(async () => {
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
  }, []);

  return (
    <LiveKitRoom
      serverUrl={connectionDetails.serverUrl}
      token={connectionDetails.participantToken}
      connect={true}
      audio={true}
      video={false}
      className="h-full"
      onConnected={handleConnected}
    >
      <TriviaGameInner connectionDetails={connectionDetails} onStop={onStop} />
    </LiveKitRoom>
  );
}

function TriviaGameInner({
  connectionDetails,
  onStop,
}: {
  connectionDetails: ConnectionDetails;
  onStop: () => void;
}) {
  const { duration } = useGameTimer();
  const { connectionStatus, agentStatus, agentState } = useGameStatus();

  return (
    <div className="h-full flex flex-col">
      <GameHeader
        roomName={connectionDetails.roomName}
        duration={duration}
        connectionStatus={connectionStatus}
        agentStatus={agentStatus}
        onStop={onStop}
      />

      <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-hidden">
        <div className="h-full w-full max-w-5xl mx-auto">
          <VoiceSection />
        </div>
      </div>

      <NoAgentNotification state={agentState} />

      <RoomAudioRenderer />
    </div>
  );
}
