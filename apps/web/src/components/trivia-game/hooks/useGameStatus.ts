import {
  useConnectionState,
  useVoiceAssistant,
} from "@livekit/components-react";
import { getConnectionStatus, getAgentStatus } from "../utils/formatters";

export const useGameStatus = () => {
  const connectionState = useConnectionState();
  const { state: agentState } = useVoiceAssistant();

  const connectionStatus = getConnectionStatus(connectionState);
  const agentStatus = getAgentStatus(agentState);

  return {
    connectionStatus,
    agentStatus,
    agentState,
  };
};
