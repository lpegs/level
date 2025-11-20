import { GameState, SkillType, SkillElement, Projectile, Vector2D } from "@/types/game";

export function updateSkills(
  gameState: GameState,
  deltaTime: number
): GameState {
  let newState = { ...gameState };
  const newProjectiles: Projectile[] = [];

  newState.player.skills = newState.player.skills.map((skill) => {
    let updatedSkill = {
      ...skill,
      currentCooldown: Math.max(0, skill.currentCooldown - deltaTime),
    };

    if (updatedSkill.currentCooldown <= 0) {
      switch (skill.type) {
        case SkillType.FIREBALL:
          const fireballProjectiles = createFireballProjectiles(
            newState,
            skill.level,
            skill.elements
          );
          if (fireballProjectiles.length > 0) {
            newProjectiles.push(...fireballProjectiles);
            const cooldownReduction = Math.max(0.3, skill.cooldown - (skill.level * 0.05));
            updatedSkill.currentCooldown = cooldownReduction;
          }
          break;

        case SkillType.LIGHTNING:
          // Lightning creates a damaging circle around the player
          if (newState.enemies.length > 0) {
            newState = applyLightningPulse(newState, skill.level, skill.elements);
            updatedSkill.currentCooldown = skill.cooldown;
          }
          break;

        case SkillType.ORBIT:
          const playerSkill = newState.player.skills.find(s => s.type === SkillType.ORBIT);
          const baseCount = 2;
          const enhancementCount = playerSkill ? Math.floor(playerSkill.level / 10) : 0;
          const expectedCount = baseCount + enhancementCount;
          
          if (newState.orbiting.length !== expectedCount) {
            newState.orbiting = createOrbitingProjectiles(newState, skill.level);
          }
          break;
      }
    }

    return updatedSkill;
  });

  newState.orbiting = updateOrbitingProjectiles(
    newState.orbiting,
    newState.player.position,
    deltaTime
  );

  newState.projectiles = [...newState.projectiles, ...newProjectiles];

  return newState;
}

function createFireballProjectiles(
  gameState: GameState,
  level: number,
  elements: SkillElement[]
): Projectile[] {
  const projectiles: Projectile[] = [];
  const playerSkill = gameState.player.skills.find(s => s.type === SkillType.FIREBALL);
  const baseCount = 1;
  const enhancementCount = playerSkill ? Math.floor(playerSkill.level / 10) : 0;
  const count = baseCount + enhancementCount;

  if (gameState.enemies.length === 0) return projectiles;

  const sortedEnemies = [...gameState.enemies].sort((a, b) => {
    const distA = Math.hypot(
      a.position.x - gameState.player.position.x,
      a.position.y - gameState.player.position.y
    );
    const distB = Math.hypot(
      b.position.x - gameState.player.position.x,
      b.position.y - gameState.player.position.y
    );
    return distA - distB;
  });

  for (let i = 0; i < Math.min(count, sortedEnemies.length); i++) {
    const target = sortedEnemies[i];
    const dx = target.position.x - gameState.player.position.x;
    const dy = target.position.y - gameState.player.position.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance > 0) {
      const speed = 300;
      const baseDamage = 10;
      const damage = baseDamage + (level * 2);
      
      let piercing = 0;
      if (elements.includes(SkillElement.WATER)) {
        piercing = 2;
      }

      projectiles.push({
        position: { ...gameState.player.position },
        velocity: {
          x: (dx / distance) * speed,
          y: (dy / distance) * speed,
        },
        damage: damage,
        radius: 8,
        lifetime: 3,
        piercing: piercing,
        elements: elements.length > 0 ? [...elements] : [],
      });
    }
  }

  return projectiles;
}

function applyLightningPulse(
  gameState: GameState,
  level: number,
  elements: SkillElement[]
): GameState {
  // Lightning damages nearby enemies - very simple
  const radius = 200; // Fixed radius
  const damage = 20 + (level * 3);
  const px = gameState.player.position.x;
  const py = gameState.player.position.y;
  
  let hitCount = 0;

  // Damage up to 3 enemies within radius
  for (let i = 0; i < gameState.enemies.length && hitCount < 3; i++) {
    const enemy = gameState.enemies[i];
    const dx = enemy.position.x - px;
    const dy = enemy.position.y - py;
    
    // Simple distance check (no sqrt)
    if (dx * dx + dy * dy <= 40000) { // 40000 = 200*200
      enemy.health -= damage;
      hitCount++;
    }
  }

  // Simple visual - just show player position
  if (hitCount > 0) {
    gameState.lightningEffects.push({
      targets: [{ x: px, y: py }],
      duration: 0.3,
    });
  }

  return gameState;
}

function applyElementEffect(enemy: any, element: SkillElement, gameTime: number): void {
  switch (element) {
    case SkillElement.FIRE:
      enemy.burningDamage = 2;
      enemy.burningDuration = gameTime + 3;
      break;
    case SkillElement.ICE:
      enemy.slowedUntil = gameTime + 2;
      break;
    case SkillElement.LIGHTNING:
      break;
    case SkillElement.WATER:
      break;
  }
}

function createOrbitingProjectiles(
  gameState: GameState,
  level: number
): Projectile[] {
  const playerSkill = gameState.player.skills.find(s => s.type === SkillType.ORBIT);
  const baseCount = 2;
  const enhancementCount = playerSkill ? Math.floor(playerSkill.level / 10) : 0;
  const count = baseCount + enhancementCount;
  
  const projectiles: Projectile[] = [];
  const baseDamage = 8;
  const damage = baseDamage + (level * 2);
  const elements = playerSkill?.elements || [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 60;

    projectiles.push({
      position: {
        x: gameState.player.position.x + Math.cos(angle) * radius,
        y: gameState.player.position.y + Math.sin(angle) * radius,
      },
      velocity: { x: 0, y: 0 },
      damage: damage,
      radius: 10,
      lifetime: Infinity,
      piercing: 999,
      elements: elements.length > 0 ? [...elements] : [],
    });
  }

  return projectiles;
}

let orbitAngle = 0;

function updateOrbitingProjectiles(
  projectiles: Projectile[],
  playerPosition: Vector2D,
  deltaTime: number
): Projectile[] {
  const orbitSpeed = 2;
  const orbitRadius = 60;

  orbitAngle += deltaTime * orbitSpeed;

  return projectiles.map((proj, index) => {
    const totalOrbs = projectiles.length;
    const baseAngle = (index / totalOrbs) * Math.PI * 2;
    const currentAngle = baseAngle + orbitAngle;

    return {
      ...proj,
      position: {
        x: playerPosition.x + Math.cos(currentAngle) * orbitRadius,
        y: playerPosition.y + Math.sin(currentAngle) * orbitRadius,
      },
    };
  });
}
