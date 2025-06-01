import { ConnectionState } from "livekit-client";
import { CONNECTION_STATUS, AGENT_STATUS } from "./constants";

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getConnectionStatus = (connectionState: ConnectionState) => {
  switch (connectionState) {
    case ConnectionState.Connecting:
      return CONNECTION_STATUS.CONNECTING;
    case ConnectionState.Connected:
      return CONNECTION_STATUS.CONNECTED;
    case ConnectionState.Disconnected:
      return CONNECTION_STATUS.DISCONNECTED;
    case ConnectionState.Reconnecting:
      return CONNECTION_STATUS.RECONNECTING;
    default:
      return CONNECTION_STATUS.UNKNOWN;
  }
};

export const getAgentStatus = (agentState: string) => {
  switch (agentState) {
    case "connecting":
      return AGENT_STATUS.CONNECTING;
    case "listening":
      return AGENT_STATUS.LISTENING;
    case "thinking":
      return AGENT_STATUS.THINKING;
    case "speaking":
      return AGENT_STATUS.SPEAKING;
    default:
      return AGENT_STATUS.OFFLINE;
  }
};
