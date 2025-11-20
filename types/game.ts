export interface Vector2D {
  x: number;
  y: number;
}

export interface Entity {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  health: number;
  maxHealth: number;
}

export interface Camera {
  x: number;
  y: number;
}

export interface Player extends Entity {
  speed: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  skills: Skill[];
}

export interface Enemy extends Entity {
  speed: number;
  damage: number;
  xpValue: number;
  type: EnemyType;
  slowedUntil?: number;
  burningDamage?: number;
  burningDuration?: number;
}

export enum EnemyType {
  ZOMBIE = "ZOMBIE",
  GHOST = "GHOST",
  DEMON = "DEMON",
}

export interface Projectile {
  position: Vector2D;
  velocity: Vector2D;
  damage: number;
  radius: number;
  lifetime: number;
  piercing: number;
  elements: SkillElement[];
}

export enum SkillElement {
  NONE = "NONE",
  FIRE = "FIRE",
  WATER = "WATER",
  LIGHTNING = "LIGHTNING",
  ICE = "ICE",
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  cooldown: number;
  currentCooldown: number;
  type: SkillType;
  elements: SkillElement[];
}

export enum SkillType {
  FIREBALL = "FIREBALL",
  LIGHTNING = "LIGHTNING",
  ORBIT = "ORBIT",
}

export interface SkillConfig {
  damage: number;
  range: number;
  speed?: number;
  count?: number;
  piercing?: number;
}

export interface LightningEffect {
  targets: Vector2D[];
  duration: number;
  chains?: Array<{ from: Vector2D; to: Vector2D }>;
}

export interface GameState {
  player: Player;
  camera: Camera;
  enemies: Enemy[];
  projectiles: Projectile[];
  orbiting: Projectile[];
  lightningEffects: LightningEffect[];
  spawnTimer: number;
  gameTime: number;
  isPaused: boolean;
  isLevelingUp: boolean;
  availableSkills: Skill[];
}
