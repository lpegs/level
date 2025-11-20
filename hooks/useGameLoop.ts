import { useEffect, useRef } from "react";
import { GameState } from "@/types/game";
import { Keys } from "./usePlayerControls";
import { updatePlayer } from "@/utils/player";
import { updateEnemies, spawnEnemies } from "@/utils/enemies";
import { updateSkills } from "@/utils/skills";
import { updateProjectiles } from "@/utils/projectiles";
import { checkCollisions } from "@/utils/collision";
import { render } from "@/utils/render";

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  keys: Keys,
  canvasWidth: number,
  canvasHeight: number,
  onGameOver?: () => void,
  otherPlayers?: Map<string, any>,
  isHost?: boolean,
  onXPGained?: (amount: number) => void
) {
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = lastTimeRef.current
        ? (currentTime - lastTimeRef.current) / 1000
        : 0;
      lastTimeRef.current = currentTime;

      if (!gameState.isPaused && !gameState.isLevelingUp) {
        setGameState((prev) => {
          let newState = { ...prev };

          newState.gameTime += deltaTime;

          newState.player = updatePlayer(
            newState.player,
            keys,
            deltaTime,
            canvasWidth,
            canvasHeight
          );

          const deadZone = 100;
          const playerScreenX = newState.player.position.x - newState.camera.x;
          const playerScreenY = newState.player.position.y - newState.camera.y;
          
          let cameraX = newState.camera.x;
          let cameraY = newState.camera.y;

          if (playerScreenX < canvasWidth / 2 - deadZone) {
            cameraX = newState.player.position.x - (canvasWidth / 2 - deadZone);
          } else if (playerScreenX > canvasWidth / 2 + deadZone) {
            cameraX = newState.player.position.x - (canvasWidth / 2 + deadZone);
          }

          if (playerScreenY < canvasHeight / 2 - deadZone) {
            cameraY = newState.player.position.y - (canvasHeight / 2 - deadZone);
          } else if (playerScreenY > canvasHeight / 2 + deadZone) {
            cameraY = newState.player.position.y - (canvasHeight / 2 + deadZone);
          }

          newState.camera = { x: cameraX, y: cameraY };

          // Only host spawns enemies in multiplayer, or always spawn in solo
          if (isHost !== false) {
            newState = spawnEnemies(newState, canvasWidth, canvasHeight, deltaTime);
          }

          // Both host and clients update enemy movement locally for smooth visuals
          newState.enemies = updateEnemies(
            newState.enemies,
            newState.player,
            deltaTime,
            newState.gameTime
          );

          newState = updateSkills(newState, deltaTime);

          newState.projectiles = updateProjectiles(
            newState.projectiles,
            deltaTime
          );

          const collisionResult = checkCollisions(newState);
          newState.enemies = collisionResult.enemies;
          newState.projectiles = collisionResult.projectiles;
          newState.orbiting = collisionResult.orbiting;
          newState.lightningEffects = [...newState.lightningEffects, ...collisionResult.lightningEffects];

          newState.lightningEffects = newState.lightningEffects
            .map((effect) => ({
              ...effect,
              duration: effect.duration - deltaTime,
            }))
            .filter((effect) => effect.duration > 0);

          // Handle XP collection and enemy removal
          const xpGained = newState.enemies
            .filter(e => e.health <= 0)
            .reduce((total, e) => total + (e.xpValue || 0), 0);

          if (xpGained > 0) {
            newState.player.xp += xpGained;
            // Share XP with other players in multiplayer
            if (onXPGained) {
              onXPGained(xpGained);
            }
          }

          newState.enemies = newState.enemies.filter((enemy) => enemy.health > 0);

          if (newState.player.xp >= newState.player.xpToNextLevel) {
            newState.player.level += 1;
            newState.player.xp -= newState.player.xpToNextLevel;
            newState.player.xpToNextLevel = Math.floor(
              newState.player.xpToNextLevel * 1.2
            );
            newState.isLevelingUp = true;
            newState.isPaused = true;
          }

          if (newState.player.health <= 0) {
            newState.isPaused = true;
            if (onGameOver) {
              onGameOver();
            }
          }

          return newState;
        });
      }

      render(ctx, gameState, canvasWidth, canvasHeight, otherPlayers);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, gameState, setGameState, keys, canvasWidth, canvasHeight]);
}
