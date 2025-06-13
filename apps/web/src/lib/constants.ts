// Animation constants
export const ANIMATIONS = {
  TYPEWRITER_DELAY: 50,
  MATRIX_RAIN_INTERVAL: 50,
  MATRIX_RESET_PROBABILITY: 0.975,
  TYPEWRITER_DEFAULT_DELAY: 0.5,
  FADE_DURATION: 0.3,
  TRANSCRIPTION_ANIMATION_DURATION: 0.3,
} as const;

// Color constants
export const COLORS = {
  PRIMARY: "#22c55e",
  SECONDARY: "#16a34a",
  ACCENT: "#fbbf24",
  ERROR: "#ef4444",
  BACKGROUND: "#000000",
  BORDER_OPACITY: 0.3,
  TEXT_OPACITY: 0.7,
  BACKGROUND_OPACITY: 0.5,
} as const;

// Layout constants
export const LAYOUT = {
  MAX_WIDTH: "6xl",
  PADDING: "px-4 py-16",
  MATRIX_COLUMN_WIDTH: 20,
  MATRIX_OPACITY: 0.05,
  LANDING_MATRIX_OPACITY: 0.1,
  TRANSCRIPTION_HEIGHT: 300,
  AGENT_VISUALIZER_HEIGHT: 300,
  VIDEO_SIZE: 512,
} as const;

// Tech stack data
export const TECH_STACK = [
  { name: "LiveKit Agents", desc: "Real-time voice processing" },
  { name: "OpenAI Realtime API", desc: "AI conversation engine" },
  { name: "Next.js 15", desc: "React framework" },
  { name: "Framer Motion", desc: "Smooth animations" },
  { name: "Tailwind CSS", desc: "Styling system" },
  { name: "TypeScript", desc: "Type safety" },
] as const;

export const RESOURCES = [
  {
    name: "slides",
    desc: "Tech talk presentation",
    icon: "📊",
    url: "https://pitch.com/v/voice-ai-max-barinov-2khgjs",
  },

  {
    name: "livekit-agents",
    desc: "LiveKit Agents",
    icon: "🤖",
    url: "https://docs.livekit.io/agents/",
  },
  {
    name: "pipecat",
    desc: "Pipecat",
    icon: "🐍",
    url: "https://docs.pipecat.ai/getting-started/overview",
  },
  {
    name: "github",
    desc: "Source code",
    icon: "🐙",
    url: "https://github.com/mbarinov/trivia-voice",
  },
  {
    name: "voiceai-handbook",
    desc: "Handbook about Voice AI from Daily team",
    icon: "📖",
    url: "https://voiceaiandvoiceagents.com/",
  },
  {
    name: "cathy-pearl-vui",
    desc: "Cathy Pearl — Designing Voice User Interfaces",
    icon: "🎤",
    url: "https://www.oreilly.com/library/view/designing-voice-user/9781491955406",
  },
  {
    name: "openai-voice",
    desc: "OpenAI Realtime API Documentation",
    icon: "🎙️",
    url: "https://platform.openai.com/docs/guides/realtime",
  },
  {
    name: "elevenlabs",
    desc: "ElevenLabs Voice AI Platform",
    icon: "🎭",
    url: "https://elevenlabs.io/",
  },
  {
    name: "deepgram",
    desc: "Deepgram Speech Recognition",
    icon: "🎯",
    url: "https://deepgram.com/",
  },
  {
    name: "cartesia",
    desc: "Cartesia Voice AI Platform",
    icon: "⚡",
    url: "https://cartesia.ai/",
  },
] as const;
