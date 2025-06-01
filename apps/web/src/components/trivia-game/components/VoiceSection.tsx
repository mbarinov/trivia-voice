import {
  useVoiceAssistant,
  VoiceAssistantControlBar,
  BarVisualizer,
} from "@livekit/components-react";
import { UI_CONSTANTS } from "../utils/constants";

export function VoiceSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 text-lg">🎤</span>
        <h3 className="text-lg font-bold text-amber-400">voice.visualizer</h3>
      </div>

      {/* Visualizer Card */}
      <div
        className={`bg-gradient-to-br from-black/80 to-green-900/20 border border-green-400/40 rounded-xl p-8 ${UI_CONSTANTS.VISUALIZER_HEIGHT} flex flex-col items-center justify-center shadow-lg shadow-green-400/10`}
      >
        <div className="w-full h-full">
          <VoiceVisualizer />
        </div>
        <div className="mt-4 text-center">
          <div className="text-green-400/70 text-sm font-mono">
            AI Agent Audio Activity
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className="bg-gradient-to-br from-black/80 to-gray-900/20 border border-green-400/30 rounded-xl p-6 shadow-lg shadow-green-400/5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-amber-400">⚙️</span>
          <h4 className="text-sm font-bold text-amber-400">controls</h4>
        </div>
        <VoiceAssistantControlBar />
      </div>
    </div>
  );
}

function VoiceVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <BarVisualizer
        barCount={UI_CONSTANTS.BAR_COUNT}
        state={state}
        trackRef={audioTrack}
        options={{
          minHeight: UI_CONSTANTS.MIN_BAR_HEIGHT,
        }}
      />
    </div>
  );
}
