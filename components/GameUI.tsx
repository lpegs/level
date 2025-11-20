import { GameState } from "@/types/game";

interface GameUIProps {
  gameState: GameState;
  showStatsHint: boolean;
}

export default function GameUI({ gameState, showStatsHint, playerCount }: GameUIProps & { playerCount?: number }) {
  const { player, gameTime } = gameState;
  const healthPercent = (player.health / player.maxHealth) * 100;
  const xpPercent = (player.xp / player.xpToNextLevel) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="text-3xl font-bold text-white drop-shadow-lg">
          {formatTime(gameTime)}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none px-4 pb-4">
        <div className="max-w-md mx-auto space-y-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full h-6 overflow-hidden border border-red-900">
            <div
              className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-blue-900">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none space-y-2">
        {showStatsHint && (
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500 flex items-center gap-2 animate-pulse">
            <div className="bg-purple-600 px-3 py-1 rounded text-white font-bold text-sm">
              TAB
            </div>
            <span className="text-white text-sm">Stats</span>
          </div>
        )}
        
        {playerCount && playerCount >= 1 && (
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500 flex items-center gap-2">
            <span className="text-cyan-400 text-lg">👥</span>
            <span className="text-white text-sm font-semibold">{playerCount} Player{playerCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </>
  );
}
