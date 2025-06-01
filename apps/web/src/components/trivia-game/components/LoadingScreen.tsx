export function LoadingScreen() {
  return (
    <div className="text-center p-6 sm:p-8">
      <div className="animate-spin text-green-400 mb-4 text-xl sm:text-2xl">
        ⟳
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-2">
        Initializing Game...
      </h3>
      <p className="text-green-400/70 mb-4 text-sm sm:text-base px-4">
        Setting up voice connection
      </p>
      <div className="text-amber-400/70 text-xs sm:text-sm px-4 max-w-md mx-auto">
        💡 Make sure to allow microphone access when prompted
      </div>
    </div>
  );
}
