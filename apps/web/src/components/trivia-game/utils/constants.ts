export const CONNECTION_STATUS = {
  CONNECTING: {
    status: "CONNECTING",
    color: "text-amber-400",
    indicator: "⟳",
  },
  CONNECTED: {
    status: "CONNECTED",
    color: "text-green-400",
    indicator: "●",
  },
  DISCONNECTED: {
    status: "DISCONNECTED",
    color: "text-red-400",
    indicator: "●",
  },
  RECONNECTING: {
    status: "RECONNECTING",
    color: "text-amber-400",
    indicator: "⟳",
  },
  UNKNOWN: {
    status: "UNKNOWN",
    color: "text-gray-400",
    indicator: "?",
  },
} as const;

export const AGENT_STATUS = {
  CONNECTING: {
    status: "INITIALIZING",
    color: "text-amber-400",
  },
  LISTENING: {
    status: "LISTENING",
    color: "text-green-400",
  },
  THINKING: {
    status: "THINKING",
    color: "text-blue-400",
  },
  SPEAKING: {
    status: "SPEAKING",
    color: "text-purple-400",
  },
  OFFLINE: {
    status: "OFFLINE",
    color: "text-gray-400",
  },
} as const;

export const UI_CONSTANTS = {
  CHAT_HEIGHT: "calc(100vh-20rem)",
  VISUALIZER_HEIGHT: "h-80",
  BAR_COUNT: 7,
  MIN_BAR_HEIGHT: 24,
} as const;
