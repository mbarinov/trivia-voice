import { type ReactNode } from "react";

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Animation-related types
export interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
}

export interface MatrixRainProps {
  opacity?: number;
}

// Resource-related types
export interface Resource {
  name: string;
  desc: string;
  icon: string;
  url: string;
}

export interface TechStackItem {
  name: string;
  desc: string;
}

// Voice assistant related types
export interface VoiceAssistantProps {
  onConnectButtonClicked: () => void;
}

export interface ControlBarProps {
  onConnectButtonClicked: () => void;
}

// Transcription types (extending LiveKit types if needed)
export interface TranscriptionSegment {
  id?: string;
  text: string;
  final?: boolean;
  participant: {
    identity: string;
  };
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: unknown) => void;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}
