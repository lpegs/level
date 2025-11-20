import { Player, Vector2D } from "@/types/game";
import { Keys } from "@/hooks/usePlayerControls";

export function updatePlayer(
  player: Player,
  keys: Keys,
  deltaTime: number,
  canvasWidth: number,
  canvasHeight: number
): Player {
  const velocity: Vector2D = { x: 0, y: 0 };

  if (keys.w) velocity.y -= 1;
  if (keys.s) velocity.y += 1;
  if (keys.a) velocity.x -= 1;
  if (keys.d) velocity.x += 1;

  const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  if (magnitude > 0) {
    velocity.x = (velocity.x / magnitude) * player.speed;
    velocity.y = (velocity.y / magnitude) * player.speed;
  }

  const newPosition = {
    x: player.position.x + velocity.x * deltaTime,
    y: player.position.y + velocity.y * deltaTime,
  };

  return {
    ...player,
    position: newPosition,
    velocity,
  };
}
