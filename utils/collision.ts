import { GameState, SkillElement } from "@/types/game";

export function checkCollisions(gameState: GameState): {
  enemies: any[];
  projectiles: any[];
  orbiting: any[];
  lightningEffects: any[];
} {
  let newState = { ...gameState };

  newState = checkProjectileEnemyCollisions(newState);
  newState = checkOrbitEnemyCollisions(newState);
  newState = checkPlayerEnemyCollisions(newState);
  newState = applyBurningDamage(newState);

  newState.enemies = newState.enemies.filter((enemy) => enemy.health > 0);

  return {
    enemies: newState.enemies,
    projectiles: newState.projectiles,
    orbiting: newState.orbiting,
    lightningEffects: newState.lightningEffects,
  };
}

function checkProjectileEnemyCollisions(gameState: GameState): GameState {
  const updatedProjectiles = [...gameState.projectiles];
  const updatedEnemies = [...gameState.enemies];
  const newLightningEffects: any[] = [];

  for (let i = updatedProjectiles.length - 1; i >= 0; i--) {
    const projectile = updatedProjectiles[i];

    for (const enemy of updatedEnemies) {
      const dx = projectile.position.x - enemy.position.x;
      const dy = projectile.position.y - enemy.position.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < projectile.radius + enemy.radius) {
        enemy.health -= projectile.damage;

        projectile.elements.forEach(elem => {
          applyElementEffect(enemy, elem, gameState.gameTime);
        });

        if (projectile.elements.includes(SkillElement.LIGHTNING)) {
          const chainedEnemies = applyLightningChain(
            enemy,
            updatedEnemies,
            projectile.damage * 0.4,
            gameState.gameTime
          );
          
          if (chainedEnemies.length > 0) {
            newLightningEffects.push({
              targets: [],
              duration: 0.2,
              chains: chainedEnemies.map(chainEnemy => ({
                from: { ...enemy.position },
                to: { ...chainEnemy.position }
              }))
            });
          }
        }

        if (enemy.health <= 0) {
          gameState.player.xp += enemy.xpValue;
        }

        projectile.piercing -= 1;
        if (projectile.piercing < 0) {
          updatedProjectiles.splice(i, 1);
          break;
        }
      }
    }
  }

  return {
    ...gameState,
    projectiles: updatedProjectiles,
    enemies: updatedEnemies,
    lightningEffects: [...gameState.lightningEffects, ...newLightningEffects],
  };
}

function checkOrbitEnemyCollisions(gameState: GameState): GameState {
  const updatedEnemies = [...gameState.enemies];
  const newLightningEffects: any[] = [];
  const hitThisFrame = new Set<any>();

  for (const orb of gameState.orbiting) {
    for (const enemy of updatedEnemies) {
      if (hitThisFrame.has(enemy)) continue;

      const dx = orb.position.x - enemy.position.x;
      const dy = orb.position.y - enemy.position.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < orb.radius + enemy.radius) {
        enemy.health -= orb.damage * 0.016;
        hitThisFrame.add(enemy);

        orb.elements.forEach(elem => {
          applyElementEffect(enemy, elem, gameState.gameTime);
        });

        if (orb.elements.includes(SkillElement.LIGHTNING) && Math.random() < 0.05) {
          const chainedEnemies = applyLightningChain(
            enemy,
            updatedEnemies,
            orb.damage * 0.2,
            gameState.gameTime
          );
          
          if (chainedEnemies.length > 0) {
            newLightningEffects.push({
              targets: [],
              duration: 0.15,
              chains: chainedEnemies.map(chainEnemy => ({
                from: { ...enemy.position },
                to: { ...chainEnemy.position }
              }))
            });
          }
        }

        if (enemy.health <= 0) {
          gameState.player.xp += enemy.xpValue;
        }
      }
    }
  }

  return {
    ...gameState,
    enemies: updatedEnemies,
    lightningEffects: [...gameState.lightningEffects, ...newLightningEffects],
  };
}

function checkPlayerEnemyCollisions(gameState: GameState): GameState {
  let player = { ...gameState.player };

  for (const enemy of gameState.enemies) {
    const dx = player.position.x - enemy.position.x;
    const dy = player.position.y - enemy.position.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance < player.radius + enemy.radius) {
      player.health -= enemy.damage * 0.016;
    }
  }

  return {
    ...gameState,
    player,
  };
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
      // Lightning chaining is handled separately in collision functions
      break;
    case SkillElement.WATER:
      // Water piercing is handled by the piercing property
      break;
  }
}

function applyLightningChain(
  sourceEnemy: any,
  allEnemies: any[],
  chainDamage: number,
  gameTime: number,
  alreadyChained?: Set<any>
): any[] {
  const chainRange = 100;
  const maxChains = 1;

  const hitSet = alreadyChained || new Set();
  hitSet.add(sourceEnemy);

  const nearbyEnemies = allEnemies
    .filter(enemy => {
      if (hitSet.has(enemy)) return false;
      const distance = Math.hypot(
        enemy.position.x - sourceEnemy.position.x,
        enemy.position.y - sourceEnemy.position.y
      );
      return distance < chainRange;
    })
    .sort((a, b) => {
      const distA = Math.hypot(
        a.position.x - sourceEnemy.position.x,
        a.position.y - sourceEnemy.position.y
      );
      const distB = Math.hypot(
        b.position.x - sourceEnemy.position.x,
        b.position.y - sourceEnemy.position.y
      );
      return distA - distB;
    })
    .slice(0, maxChains);

  nearbyEnemies.forEach(enemy => {
    hitSet.add(enemy);
    enemy.health -= chainDamage;
  });

  return nearbyEnemies;
}

function applyBurningDamage(gameState: GameState): GameState {
  const updatedEnemies = gameState.enemies.map((enemy) => {
    if (enemy.burningDuration && enemy.burningDamage && gameState.gameTime < enemy.burningDuration) {
      return {
        ...enemy,
        health: enemy.health - enemy.burningDamage * 0.016,
      };
    }
    return enemy;
  });

  return {
    ...gameState,
    enemies: updatedEnemies,
  };
}
