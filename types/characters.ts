export type CharacterType = 'warrior' | 'mage' | 'ranger';

export interface Character {
  id: CharacterType;
  name: string;
  description: string;
  startingSkill: 'fireball' | 'lightning' | 'orbit';
  icon: string;
  color: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Starts with Magic Orbit - Protective orbs that circle around you',
    startingSkill: 'orbit',
    icon: '⚔️',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'mage',
    name: 'Mage',
    description: 'Starts with Lightning Strike - Instant damage in an area',
    startingSkill: 'lightning',
    icon: '🔮',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description: 'Starts with Fireball - Fast projectiles that pierce enemies',
    startingSkill: 'fireball',
    icon: '🏹',
    color: 'from-green-500 to-teal-500',
  },
];
