interface HomeScreenProps {
  onPlay: () => void;
  onMultiplayer: () => void;
  onAbout: () => void;
}

export default function HomeScreen({ onPlay, onMultiplayer, onAbout }: HomeScreenProps) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
            LEVEL
          </h1>
          <p className="text-xl text-gray-300">
            Survive. Kill. Evolve.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onPlay}
            className="w-64 px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:from-purple-500 hover:to-pink-500 active:scale-95"
          >
            SOLO PLAY
          </button>

          <button
            onClick={onMultiplayer}
            className="w-64 px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:from-blue-500 hover:to-cyan-500 active:scale-95"
          >
            MULTIPLAYER
          </button>

          <button
            onClick={onAbout}
            className="w-64 px-8 py-4 text-xl font-semibold text-purple-300 bg-gray-800/50 rounded-lg border-2 border-purple-500 shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-gray-700/50 hover:border-purple-400 active:scale-95"
          >
            ABOUT
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-8">
          Use WASD to move • Auto-attack enemies • Level up to gain powers
        </div>
      </div>
    </div>
  );
}
