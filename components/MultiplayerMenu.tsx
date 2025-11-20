import { useState } from "react";

interface MultiplayerMenuProps {
  onBack: () => void;
  onCreateParty: (playerName: string) => void;
  onJoinParty: (partyCode: string, playerName: string) => void;
  isConnected?: boolean;
}

export default function MultiplayerMenu({
  onBack,
  onCreateParty,
  onJoinParty,
  isConnected = true,
}: MultiplayerMenuProps) {
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [playerName, setPlayerName] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateParty = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (playerName.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    setIsLoading(true);
    setError("");
    onCreateParty(playerName.trim());
  };

  const handleJoinParty = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (playerName.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!partyCode.trim()) {
      setError("Please enter a party code");
      return;
    }
    if (partyCode.trim().length !== 6) {
      setError("Party code must be 6 characters");
      return;
    }
    setIsLoading(true);
    setError("");
    onJoinParty(partyCode.trim().toUpperCase(), playerName.trim());
  };

  if (mode === "create") {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500 shadow-2xl">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
            Create Party
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError("");
                }}
                maxLength={20}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border-2 border-purple-600 focus:border-purple-400 focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateParty}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating..." : "Create Party"}
            </button>

            <button
              onClick={() => setMode("menu")}
              className="w-full bg-gray-700 text-white text-lg font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500 shadow-2xl">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
            Join Party
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError("");
                }}
                maxLength={20}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border-2 border-purple-600 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">
                Party Code
              </label>
              <input
                type="text"
                value={partyCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
                  setPartyCode(value);
                  setError("");
                }}
                maxLength={6}
                placeholder="ABC123"
                className="w-full px-4 py-3 bg-gray-800 text-white text-center text-2xl font-bold tracking-widest rounded-lg border-2 border-purple-600 focus:border-purple-400 focus:outline-none uppercase"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleJoinParty}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Joining..." : "Join Party"}
            </button>

            <button
              onClick={() => setMode("menu")}
              className="w-full bg-gray-700 text-white text-lg font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Multiplayer
          </h2>
          <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
            isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setMode("create")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold py-4 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 active:scale-95"
          >
            Create Party
          </button>

          <button
            onClick={() => setMode("join")}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xl font-bold py-4 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all transform hover:scale-105 active:scale-95"
          >
            Join Party
          </button>

          <button
            onClick={onBack}
            className="w-full bg-gray-700 text-white text-lg font-semibold py-3 rounded-lg hover:bg-gray-600 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
