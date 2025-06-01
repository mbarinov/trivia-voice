import { useState, useEffect } from "react";

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export const useConnectionManager = () => {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const resetConnection = () => {
    setConnectionDetails(null);
    setError(null);
  };

  return {
    connectionDetails,
    isConnecting,
    error,
    resetConnection,
  };
};
