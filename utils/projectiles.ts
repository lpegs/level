import { Projectile } from "@/types/game";

export function updateProjectiles(
  projectiles: Projectile[],
  deltaTime: number
): Projectile[] {
  return projectiles
    .map((projectile) => ({
      ...projectile,
      position: {
        x: projectile.position.x + projectile.velocity.x * deltaTime,
        y: projectile.position.y + projectile.velocity.y * deltaTime,
      },
      lifetime: projectile.lifetime - deltaTime,
    }))
    .filter((projectile) => projectile.lifetime > 0);
}
