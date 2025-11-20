import { Character, CHARACTERS, CharacterType } from '@/types/characters';
import { useState } from 'react';

interface CharacterSelectProps {
  onSelect: (character: CharacterType) => void;
  onBack: () => void;
}

export default function CharacterSelect({ onSelect, onBack }: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('warrior');

  const handleConfirm = () => {
    onSelect(selectedCharacter);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
      <div className="max-w-6xl w-full px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
            Choose Your Hero
          </h1>
          <p className="text-xl text-gray-300">
            Each character starts with a unique skill
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          {CHARACTERS.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character.id)}
              className={`relative p-8 rounded-2xl border-4 transition-all duration-300 transform ${
                selectedCharacter === character.id
                  ? `border-white shadow-2xl scale-105 bg-gradient-to-br ${character.color}`
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-400 hover:scale-102'
              }`}
            >
              <div className="text-8xl mb-4">{character.icon}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{character.name}</h2>
              <p className={`text-sm ${selectedCharacter === character.id ? 'text-white' : 'text-gray-400'}`}>
                {character.description}
              </p>
              {selectedCharacter === character.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 text-xl font-semibold text-gray-300 bg-gray-800/50 rounded-lg border-2 border-gray-600 shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-gray-700/50 hover:border-gray-400 active:scale-95"
          >
            BACK
          </button>
          <button
            onClick={handleConfirm}
            className="px-12 py-4 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:from-purple-500 hover:to-pink-500 active:scale-95"
          >
            START GAME
          </button>
        </div>
      </div>
    </div>
  );
}
