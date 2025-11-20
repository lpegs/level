import { Enemy, EnemyType, Player, GameState, Vector2D } from "@/types/game";

const BASE_SPAWN_INTERVAL = 2.0;
const BASE_SPAWN_RATE = 1;

export function spawnEnemies(
  gameState: GameState,
  canvasWidth: number,
  canvasHeight: number,
  deltaTime: number
): GameState {
  const updatedSpawnTimer = gameState.spawnTimer + deltaTime;

  const playerLevel = gameState.player.level;
  const spawnInterval = Math.max(0.5, BASE_SPAWN_INTERVAL - (playerLevel * 0.1));
  const spawnRate = BASE_SPAWN_RATE + Math.floor(playerLevel / 2);

  if (updatedSpawnTimer < spawnInterval) {
    return {
      ...gameState,
      spawnTimer: updatedSpawnTimer,
    };
  }

  const newEnemies: Enemy[] = [];
  const spawnMargin = 50;

  for (let i = 0; i < spawnRate; i++) {
    const side = Math.floor(Math.random() * 4);
    let position: Vector2D;

    switch (side) {
      case 0:
        position = {
          x: gameState.camera.x + Math.random() * canvasWidth,
          y: gameState.camera.y - spawnMargin,
        };
        break;
      case 1:
        position = {
          x: gameState.camera.x + canvasWidth + spawnMargin,
          y: gameState.camera.y + Math.random() * canvasHeight,
        };
        break;
      case 2:
        position = {
          x: gameState.camera.x + Math.random() * canvasWidth,
          y: gameState.camera.y + canvasHeight + spawnMargin,
        };
        break;
      default:
        position = {
          x: gameState.camera.x - spawnMargin,
          y: gameState.camera.y + Math.random() * canvasHeight,
        };
    }

    const type = Math.random() < 0.7 ? EnemyType.ZOMBIE : 
                 Math.random() < 0.5 ? EnemyType.GHOST : EnemyType.DEMON;

    const healthMultiplier = 1 + (playerLevel - 1) * 0.15;
    const baseHealth = type === EnemyType.DEMON ? 30 : type === EnemyType.GHOST ? 15 : 10;
    const scaledHealth = Math.floor(baseHealth * healthMultiplier);

    const enemy: Enemy = {
      id: `enemy_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      position,
      velocity: { x: 0, y: 0 },
      radius: type === EnemyType.DEMON ? 20 : 12,
      health: scaledHealth,
      maxHealth: scaledHealth,
      speed: type === EnemyType.GHOST ? 100 : type === EnemyType.DEMON ? 60 : 80,
      damage: type === EnemyType.DEMON ? 15 : type === EnemyType.GHOST ? 8 : 10,
      xpValue: type === EnemyType.DEMON ? 5 : type === EnemyType.GHOST ? 3 : 2,
      type,
    };

    newEnemies.push(enemy);
  }

  return {
    ...gameState,
    enemies: [...gameState.enemies, ...newEnemies],
    spawnTimer: 0,
  };
}

export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  deltaTime: number,
  gameTime: number
): Enemy[] {
  return enemies.map((enemy) => {
    const dx = player.position.x - enemy.position.x;
    const dy = player.position.y - enemy.position.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance > 0) {
      const isSlowed = enemy.slowedUntil && gameTime < enemy.slowedUntil;
      const speedMultiplier = isSlowed ? 0.5 : 1;
      
      const velocity = {
        x: (dx / distance) * enemy.speed * speedMultiplier,
        y: (dy / distance) * enemy.speed * speedMultiplier,
      };

      return {
        ...enemy,
        position: {
          x: enemy.position.x + velocity.x * deltaTime,
          y: enemy.position.y + velocity.y * deltaTime,
        },
        velocity,
      };
    }

    return enemy;
  });
}
