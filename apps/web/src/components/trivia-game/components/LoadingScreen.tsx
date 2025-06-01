export function LoadingScreen() {
  return (
    <div className="text-center p-8">
      <div className="animate-spin text-green-400 mb-4 text-2xl">⟳</div>
      <h3 className="text-xl font-bold text-green-400 mb-2">
        Initializing Game...
      </h3>
      <p className="text-green-400/70 mb-4">Setting up voice connection</p>
      <div className="text-amber-400/70 text-sm">
        💡 Make sure to allow microphone access when prompted
      </div>
    </div>
  );
}
