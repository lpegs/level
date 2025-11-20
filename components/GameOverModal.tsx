import { GameState } from "@/types/game";

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function GameOverModal({
  gameState,
  onRestart,
  onMainMenu,
}: GameOverModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalKills = gameState.enemies.filter(e => e.health <= 0).length;

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto">
      <div className="bg-gradient-to-br from-gray-900 to-red-900 p-12 rounded-xl shadow-2xl max-w-2xl border-4 border-red-600">
        <h2 className="text-6xl font-bold text-red-500 mb-8 text-center drop-shadow-lg">
          GAME OVER
        </h2>

        <div className="bg-black/50 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Final Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div className="text-gray-300">
              <div className="flex justify-between mb-2">
                <span>Survival Time:</span>
                <span className="text-yellow-400 font-bold">{formatTime(gameState.gameTime)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Level Reached:</span>
                <span className="text-purple-400 font-bold">{gameState.player.level}</span>
              </div>
            </div>
            
            <div className="text-gray-300">
              <div className="flex justify-between mb-2">
                <span>Total XP:</span>
                <span className="text-blue-400 font-bold">{Math.round(gameState.player.xp)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Skills Unlocked:</span>
                <span className="text-green-400 font-bold">{gameState.player.skills.length}</span>
              </div>
            </div>
          </div>

          {gameState.player.skills.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-purple-300 mb-3">Your Skills:</h4>
              <div className="grid grid-cols-3 gap-3">
                {gameState.player.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-purple-900/50 border border-purple-600 p-3 rounded-lg text-center"
                  >
                    <div className="font-semibold text-white text-sm">{skill.name}</div>
                    <div className="text-purple-300 text-xs">Level {skill.level}</div>
                    {skill.elements && skill.elements.length > 0 && (
                      <div className="mt-1">
                        {skill.elements.map((elem) => (
                          <span key={elem} className="text-lg">
                            {elem === "FIRE" && "🔥"}
                            {elem === "ICE" && "❄️"}
                            {elem === "LIGHTNING" && "⚡"}
                            {elem === "WATER" && "💧"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-2xl font-bold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🔄 Play Again
          </button>

          <button
            onClick={onMainMenu}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white text-xl font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
