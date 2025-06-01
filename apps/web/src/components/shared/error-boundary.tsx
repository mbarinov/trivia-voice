"use client";

import { Component, type ReactNode } from "react";
import type { ErrorBoundaryState, ErrorBoundaryProps } from "@/lib/types";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4">
          <div className="bg-black/70 border border-red-400/30 rounded-lg p-6 max-w-2xl">
            <div className="text-red-400/70 text-sm mb-2 font-mono">
              ~/error $ system.crash --trace
            </div>
            <pre className="text-red-400 text-sm mb-4">
              {`┌─ SYSTEM ERROR ──────────────────────────┐
│                                         │
│  Status: CRITICAL FAILURE               │
│  Code:   COMPONENT_CRASH                │
│  Action: FALLBACK_INITIATED              │
│                                         │
│  Something went wrong with the app      │
│  Please refresh or try again later      │
│                                         │
└─────────────────────────────────────────┘`}
            </pre>

            <button
              onClick={() => window.location.reload()}
              className="bg-red-400 text-black px-4 py-2 rounded font-bold text-sm hover:bg-red-300 transition-all duration-200"
            >
              &gt; RESTART SYSTEM
            </button>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4">
                <summary className="text-red-400/70 cursor-pointer hover:text-red-400">
                  &gt; show error details
                </summary>
                <pre className="text-red-400/50 text-xs mt-2 p-2 bg-red-400/5 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
