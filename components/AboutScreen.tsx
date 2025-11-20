interface AboutScreenProps {
  onBack: () => void;
}

export default function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
      <div className="max-w-3xl bg-gray-900/80 backdrop-blur-sm rounded-2xl p-12 border-2 border-purple-500 shadow-2xl">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8">
          About LEVEL
        </h2>

        <div className="space-y-6 text-gray-300 text-lg">
          <p>
            <strong className="text-purple-400">LEVEL</strong> is a roguelike survival game where you fight endless waves of enemies, 
            gain experience, and unlock powerful abilities.
          </p>

          <div>
            <h3 className="text-2xl font-semibold text-purple-400 mb-3">How to Play</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use <strong>WASD</strong> keys to move your character</li>
              <li>Your skills automatically attack nearby enemies</li>
              <li>Kill enemies to gain experience points</li>
              <li>Level up to unlock or upgrade skills</li>
              <li>Survive as long as you can!</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-purple-400 mb-3">Skills</h3>
            <div className="space-y-3 ml-4">
              <div>
                <strong className="text-orange-400">🔥 Fireball:</strong> Auto-shoots projectiles at the nearest enemies
              </div>
              <div>
                <strong className="text-yellow-400">⚡ Lightning Strike:</strong> Strikes random enemies with devastating lightning
              </div>
              <div>
                <strong className="text-purple-400">🔮 Magic Orbit:</strong> Magical orbs orbit around you, damaging enemies on contact
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-purple-400 mb-3">Enemy Types</h3>
            <div className="space-y-2 ml-4">
              <div>
                <strong className="text-green-400">🧟 Zombies:</strong> Basic enemies with moderate speed
              </div>
              <div>
                <strong className="text-purple-400">👻 Ghosts:</strong> Fast-moving enemies with less health
              </div>
              <div>
                <strong className="text-red-400">😈 Demons:</strong> Powerful enemies with high health and damage
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 pt-4">
            Built with Next.js, React, TypeScript, and Canvas API
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-8 w-full px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:from-purple-500 hover:to-pink-500 active:scale-95"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
