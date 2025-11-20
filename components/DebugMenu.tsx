import { GameState } from "@/types/game";

interface DebugMenuProps {
  gameState: GameState;
  onLevelUp: () => void;
  onAddXP: (amount: number) => void;
  onHeal: () => void;
  onSpawnEnemies: (count: number) => void;
  partyCode?: string;
  otherPlayersCount?: number;
  isHost?: boolean;
}

export default function DebugMenu({
  gameState,
  onLevelUp,
  onAddXP,
  onHeal,
  onSpawnEnemies,
  partyCode,
  otherPlayersCount = 0,
  isHost = false,
}: DebugMenuProps) {
  return (
    <div className="absolute top-20 right-4 bg-black/90 backdrop-blur-md border-2 border-green-500 rounded-lg p-4 shadow-2xl pointer-events-auto min-w-[250px]">
      <div className="flex items-center justify-between mb-3 border-b border-green-500 pb-2">
        <h3 className="text-green-400 font-bold text-lg">
          🐛 Debug Menu
        </h3>
        <div className="text-xs text-gray-400">
          ` or CTRL
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="text-gray-300">
          <div>Level: {gameState.player.level}</div>
          <div>XP: {Math.round(gameState.player.xp)} / {gameState.player.xpToNextLevel}</div>
          <div>Health: {Math.round(gameState.player.health)} / {gameState.player.maxHealth}</div>
          <div>Enemies: {gameState.enemies.length}</div>
          <div>Time: {Math.round(gameState.gameTime)}s</div>
          {partyCode && (
            <>
              <div className="border-t border-green-700 pt-2 mt-2">
                <div className="text-cyan-400">🌐 Multiplayer</div>
                <div className="text-xs">Code: {partyCode}</div>
                <div className="text-xs">Role: {isHost ? '👑 HOST' : '📱 CLIENT'}</div>
                <div className="text-xs">Others: {otherPlayersCount}</div>
              </div>
            </>
          )}
        </div>

        {gameState.player.skills.length > 0 && (
          <div className="border-t border-green-700 pt-2 text-gray-300">
            <div className="font-semibold text-green-400 mb-1">Skills:</div>
            {gameState.player.skills.map((skill) => (
              <div key={skill.id} className="text-xs flex items-center gap-1">
                <span>{skill.name} Lv.{skill.level}</span>
                {skill.elements && skill.elements.length > 0 && (
                  <span>
                    {skill.elements.map((elem) => (
                      <span key={elem}>
                        {elem === "FIRE" && "🔥"}
                        {elem === "ICE" && "❄️"}
                        {elem === "LIGHTNING" && "⚡"}
                        {elem === "WATER" && "💧"}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-green-700 pt-2 space-y-2">
          <button
            onClick={onLevelUp}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            ⬆️ Level Up
          </button>

          <button
            onClick={() => onAddXP(50)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            ➕ Add 50 XP
          </button>

          <button
            onClick={onHeal}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            ❤️ Heal Full
          </button>

          <button
            onClick={() => onSpawnEnemies(10)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            👾 Spawn 10 Enemies
          </button>

          <button
            onClick={() => onSpawnEnemies(50)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors text-xs"
          >
            👹 Spawn 50 Enemies
          </button>
        </div>
      </div>
    </div>
  );
}
