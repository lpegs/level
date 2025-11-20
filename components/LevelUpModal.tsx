import { Skill, SkillElement } from "@/types/game";
import { useState } from "react";

interface LevelUpModalProps {
  availableSkills: Skill[];
  playerSkills: Skill[];
  onSelectSkill: (skill: Skill, enhancement?: { type: 'element' | 'count', value?: SkillElement }) => void;
}

export default function LevelUpModal({
  availableSkills,
  playerSkills,
  onSelectSkill,
}: LevelUpModalProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showEnhancement, setShowEnhancement] = useState(false);

  const getSkillOptions = () => {
    const options: Skill[] = [];
    
    for (const skill of availableSkills) {
      const playerSkill = playerSkills.find((s) => s.id === skill.id);
      
      if (!playerSkill) {
        options.push(skill);
      } else {
        options.push(playerSkill);
      }
    }
    
    return options.slice(0, 3);
  };

  const skillOptions = getSkillOptions();

  const handleSkillClick = (skill: Skill) => {
    const playerSkill = playerSkills.find((s) => s.id === skill.id);
    const currentLevel = playerSkill?.level || 0;
    
    if (currentLevel > 0 && (currentLevel + 1) % 10 === 0) {
      setSelectedSkill(skill);
      setShowEnhancement(true);
    } else {
      onSelectSkill(skill);
    }
  };

  const handleEnhancementSelect = (type: 'element' | 'count', element?: SkillElement) => {
    if (selectedSkill) {
      onSelectSkill(selectedSkill, { type, value: element });
      setShowEnhancement(false);
      setSelectedSkill(null);
    }
  };

  if (showEnhancement && selectedSkill) {
    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-xl shadow-2xl max-w-2xl">
          <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
            LEVEL 10 ENHANCEMENT!
          </h2>
          <p className="text-white text-center mb-6 text-xl">
            Choose a powerful enhancement for <span className="text-purple-300 font-bold">{selectedSkill.name}</span>:
          </p>
          
          {playerSkills.find(s => s.id === selectedSkill.id)?.elements && 
           playerSkills.find(s => s.id === selectedSkill.id)!.elements.length > 0 && (
            <div className="bg-purple-800/30 border border-purple-600 rounded-lg p-3 mb-4">
              <p className="text-purple-300 text-sm mb-1">Current Elements:</p>
              <div className="flex gap-2">
                {playerSkills.find(s => s.id === selectedSkill.id)!.elements.map((elem) => (
                  <span key={elem} className="text-2xl">
                    {elem === SkillElement.FIRE && "🔥"}
                    {elem === SkillElement.ICE && "❄️"}
                    {elem === SkillElement.LIGHTNING && "⚡"}
                    {elem === SkillElement.WATER && "💧"}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={() => handleEnhancementSelect('count')}
              className="w-full bg-orange-800/50 hover:bg-orange-700 p-6 rounded-lg text-left transition-all transform hover:scale-105 border-2 border-orange-600 hover:border-yellow-400"
            >
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                🔥 Increase Projectile Count
              </h3>
              <p className="text-gray-300">
                Fire more projectiles per cast, dramatically increasing damage output
              </p>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleEnhancementSelect('element', SkillElement.FIRE)}
                className="bg-red-800/50 hover:bg-red-700 p-6 rounded-lg text-left transition-all transform hover:scale-105 border-2 border-red-600 hover:border-yellow-400"
              >
                <h3 className="text-xl font-bold text-red-300 mb-2">
                  🔥 Fire Element
                </h3>
                <p className="text-gray-300 text-sm">
                  Burn enemies over time
                </p>
              </button>

              <button
                onClick={() => handleEnhancementSelect('element', SkillElement.ICE)}
                className="bg-cyan-800/50 hover:bg-cyan-700 p-6 rounded-lg text-left transition-all transform hover:scale-105 border-2 border-cyan-600 hover:border-yellow-400"
              >
                <h3 className="text-xl font-bold text-cyan-300 mb-2">
                  ❄️ Ice Element
                </h3>
                <p className="text-gray-300 text-sm">
                  Slow enemies on hit
                </p>
              </button>

              <button
                onClick={() => handleEnhancementSelect('element', SkillElement.LIGHTNING)}
                className="bg-yellow-800/50 hover:bg-yellow-700 p-6 rounded-lg text-left transition-all transform hover:scale-105 border-2 border-yellow-600 hover:border-yellow-400"
              >
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  ⚡ Lightning Element
                </h3>
                <p className="text-gray-300 text-sm">
                  Chain to nearby enemies
                </p>
              </button>

              <button
                onClick={() => handleEnhancementSelect('element', SkillElement.WATER)}
                className="bg-blue-800/50 hover:bg-blue-700 p-6 rounded-lg text-left transition-all transform hover:scale-105 border-2 border-blue-600 hover:border-yellow-400"
              >
                <h3 className="text-xl font-bold text-blue-300 mb-2">
                  💧 Water Element
                </h3>
                <p className="text-gray-300 text-sm">
                  Pierce through enemies
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-xl shadow-2xl max-w-2xl">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
          LEVEL UP!
        </h2>
        <p className="text-white text-center mb-6">Choose a skill to upgrade:</p>
        
        <div className="space-y-4">
          {skillOptions.map((skill) => {
            const playerSkill = playerSkills.find((s) => s.id === skill.id);
            const currentLevel = playerSkill?.level || 0;
            const nextLevel = currentLevel + 1;
            const isEnhancementLevel = nextLevel % 10 === 0 && currentLevel > 0;
            
            const getDamageIncrease = () => {
              const baseDamage = skill.type === "FIREBALL" ? 10 : skill.type === "LIGHTNING" ? 15 : 8;
              return baseDamage + (nextLevel * 2);
            };

            const getCooldownReduction = () => {
              return Math.max(0.3, skill.cooldown - (nextLevel * 0.05));
            };
            
            return (
              <button
                key={skill.id}
                onClick={() => handleSkillClick(skill)}
                className={`w-full ${isEnhancementLevel ? 'bg-gradient-to-r from-yellow-800/50 to-orange-800/50 border-yellow-500 animate-pulse' : 'bg-purple-800/50'} hover:bg-purple-700 p-6 rounded-lg text-left transition-all transform hover:scale-105 border-2 ${isEnhancementLevel ? 'border-yellow-500' : 'border-purple-600'} hover:border-yellow-400`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-yellow-300">
                    {skill.name}
                    {playerSkill?.elements && playerSkill.elements.length > 0 && (
                      <span className="text-sm ml-2">
                        {playerSkill.elements.map((elem) => (
                          <span key={elem}>
                            {elem === SkillElement.FIRE && "🔥"}
                            {elem === SkillElement.ICE && "❄️"}
                            {elem === SkillElement.LIGHTNING && "⚡"}
                            {elem === SkillElement.WATER && "💧"}
                          </span>
                        ))}
                      </span>
                    )}
                  </h3>
                  <span className="text-purple-300 text-lg">
                    Lvl {currentLevel} → {nextLevel}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{skill.description}</p>
                {isEnhancementLevel ? (
                  <div className="mt-2 bg-yellow-900/30 border border-yellow-500 rounded p-2">
                    <p className="text-yellow-200 font-bold text-sm">
                      ⭐ ENHANCEMENT LEVEL - Choose powerful upgrade!
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-400">
                    <div>• Damage: {getDamageIncrease()}</div>
                    {skill.cooldown > 0 && (
                      <div>• Cooldown: {getCooldownReduction().toFixed(2)}s</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
