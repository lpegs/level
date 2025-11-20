interface Party {
  code: string;
  host: string;
  players: Array<{
    id: string;
    name: string;
    level: number;
    health: number;
    isHost: boolean;
  }>;
  gameStarted: boolean;
}

interface PartyLobbyProps {
  party: Party;
  currentPlayerId: string;
  onStartGame: () => void;
  onLeaveParty: () => void;
}

export default function PartyLobby({
  party,
  currentPlayerId,
  onStartGame,
  onLeaveParty,
}: PartyLobbyProps) {
  const isHost = party.host === currentPlayerId;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500 shadow-2xl">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6 text-center">
          Party Lobby
        </h2>

        <div className="bg-black/50 rounded-lg p-6 mb-6 text-center">
          <div className="text-sm text-purple-300 mb-2">Party Code</div>
          <div className="text-5xl font-bold text-white tracking-widest">
            {party.code}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Share this code with your friends
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-purple-300 mb-4">
            Players ({party.players.length}/4)
          </h3>
          <div className="space-y-3">
            {party.players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  player.id === currentPlayerId
                    ? "bg-purple-800/50 border-2 border-purple-500"
                    : "bg-gray-800/50"
                }`}
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    player.id === currentPlayerId 
                      ? "bg-gradient-to-br from-purple-500 to-pink-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500"
                  }`}>
                    {player.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {player.name}
                      {player.id === currentPlayerId && (
                        <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">(You)</span>
                      )}
                      {player.isHost && (
                        <span className="text-xs text-yellow-400">👑 Host</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {player.isHost ? "Can start the game" : "Waiting for host"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 4 - party.players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/30 border-2 border-dashed border-gray-700"
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
                  ?
                </div>
                <div className="text-gray-500 text-sm italic">
                  Waiting for player...
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={party.players.length < 1}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white text-xl font-bold py-4 rounded-lg hover:from-green-500 hover:to-green-400 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Start Game
            </button>
          ) : (
            <div className="w-full bg-gray-800 text-gray-400 text-center text-lg font-semibold py-4 rounded-lg border-2 border-gray-700">
              Waiting for host to start...
            </div>
          )}

          <button
            onClick={onLeaveParty}
            className="w-full bg-red-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-red-500 transition-all"
          >
            Leave Party
          </button>
        </div>
      </div>
    </div>
  );
}
