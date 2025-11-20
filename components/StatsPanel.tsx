import { GameState } from "@/types/game";

interface StatsPanelProps {
  gameState: GameState;
}

export default function StatsPanel({ gameState }: StatsPanelProps) {
  const { player } = gameState;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
      <div className="bg-black/90 backdrop-blur-md border-2 border-purple-500 rounded-xl p-8 shadow-2xl min-w-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Stats
          </h2>
          <div className="bg-purple-600 px-3 py-1 rounded text-white font-bold text-sm">
            TAB to close
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-300 text-lg">Level</span>
              <span className="text-white text-2xl font-bold">{player.level}</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-300 text-lg">Health</span>
                <span className="text-white font-semibold">
                  {Math.round(player.health)} / {player.maxHealth}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300"
                  style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-300 text-lg">Experience</span>
                <span className="text-white font-semibold">
                  {Math.round(player.xp)} / {player.xpToNextLevel}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-300"
                  style={{ width: `${(player.xp / player.xpToNextLevel) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-green-300 text-lg">Movement Speed</span>
              <span className="text-white font-semibold">{player.speed}</span>
            </div>
          </div>

          {player.skills.length > 0 && (
            <div className="border-t border-purple-700 pt-4">
              <h3 className="text-xl font-bold text-purple-300 mb-3">Active Skills</h3>
              <div className="space-y-3">
                {player.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-purple-900/30 border border-purple-700 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">{skill.name}</span>
                      <span className="text-purple-300 text-sm font-bold">
                        Level {skill.level}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{skill.description}</p>
                    {skill.elements && skill.elements.length > 0 && (
                      <div className="mt-2 bg-purple-800/50 border border-purple-600 rounded px-2 py-1 flex gap-2 items-center">
                        <span className="text-purple-300 text-xs font-semibold">Elements:</span>
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

          {player.skills.length === 0 && (
            <div className="border-t border-purple-700 pt-4 text-center text-gray-500">
              No skills unlocked yet. Level up to gain skills!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
