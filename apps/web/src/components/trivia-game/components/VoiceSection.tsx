import {
  useVoiceAssistant,
  VoiceAssistantControlBar,
  BarVisualizer,
} from "@livekit/components-react";
import { UI_CONSTANTS } from "../utils/constants";
import { useResponsive, getResponsiveValue } from "../hooks/useResponsive";

export function VoiceSection() {
  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-amber-400 text-base sm:text-lg">🎤</span>
        <h3 className="text-base sm:text-lg font-bold text-amber-400">
          voice.visualizer
        </h3>
      </div>

      {/* Visualizer Card */}
      <div className="bg-gradient-to-br from-black/80 to-green-900/20 border border-green-400/40 rounded-xl p-4 sm:p-6 lg:p-8 flex-1 min-h-0 flex flex-col items-center justify-center shadow-lg shadow-green-400/10">
        <div className="w-full h-full min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
          <VoiceVisualizer />
        </div>
        <div className="mt-3 sm:mt-4 text-center flex-shrink-0">
          <div className="text-green-400/70 text-xs sm:text-sm font-mono">
            AI Agent Audio Activity
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className="bg-gradient-to-br from-black/80 to-gray-900/20 border border-green-400/30 rounded-xl p-4 sm:p-6 shadow-lg shadow-green-400/5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-amber-400">⚙️</span>
          <h4 className="text-xs sm:text-sm font-bold text-amber-400">
            controls
          </h4>
        </div>
        <VoiceAssistantControlBar />
      </div>
    </div>
  );
}

function VoiceVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();
  const screenSize = useResponsive();

  const barCount = getResponsiveValue(
    UI_CONSTANTS.BAR_COUNT.mobile,
    UI_CONSTANTS.BAR_COUNT.mobile,
    UI_CONSTANTS.BAR_COUNT.desktop,
    screenSize
  );

  const minHeight = getResponsiveValue(
    UI_CONSTANTS.MIN_BAR_HEIGHT.mobile,
    UI_CONSTANTS.MIN_BAR_HEIGHT.mobile,
    UI_CONSTANTS.MIN_BAR_HEIGHT.desktop,
    screenSize
  );

  return (
    <div className="w-full h-full flex items-center justify-center">
      <BarVisualizer
        barCount={barCount}
        state={state}
        trackRef={audioTrack}
        options={{
          minHeight,
        }}
      />
    </div>
  );
}
