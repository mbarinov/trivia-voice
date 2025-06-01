"use client";

import { useCallback } from "react";
import { GameLayout } from "./components/GameLayout";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { TriviaGameContent } from "./components/TriviaGameContent";
import { useConnectionManager } from "./hooks/useConnectionManager";

interface TriviaGameProps {
  onStop: () => void;
}

export default function TriviaGame({ onStop }: TriviaGameProps) {
  const { connectionDetails, isConnecting, error, resetConnection } =
    useConnectionManager();

  const handleStop = useCallback(() => {
    resetConnection();
    onStop();
  }, [resetConnection, onStop]);

  if (error) {
    return (
      <GameLayout>
        <ErrorScreen error={error} onRetry={handleStop} />
      </GameLayout>
    );
  }

  if (isConnecting || !connectionDetails) {
    return (
      <GameLayout>
        <LoadingScreen />
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <TriviaGameContent
        connectionDetails={connectionDetails}
        onStop={handleStop}
      />
    </GameLayout>
  );
}
