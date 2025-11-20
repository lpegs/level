import { GameState, EnemyType, SkillElement } from "@/types/game";

export function render(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  width: number,
  height: number,
  otherPlayers?: Map<string, any>
): void {
  const { camera } = gameState;

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0f0f1e";
  const gridSize = 50;
  const startX = Math.floor(camera.x / gridSize) * gridSize;
  const startY = Math.floor(camera.y / gridSize) * gridSize;

  for (let x = startX; x < camera.x + width; x += gridSize) {
    for (let y = startY; y < camera.y + height; y += gridSize) {
      if ((x / gridSize + y / gridSize) % 2 === 0) {
        const screenX = x - camera.x;
        const screenY = y - camera.y;
        ctx.fillRect(screenX, screenY, gridSize, gridSize);
      }
    }
  }

  gameState.lightningEffects.forEach((effect) => {
    effect.targets.forEach((target) => {
      const playerScreenX = gameState.player.position.x - camera.x;
      const playerScreenY = gameState.player.position.y - camera.y;
      const targetScreenX = target.x - camera.x;
      const targetScreenY = target.y - camera.y;

      ctx.beginPath();
      ctx.moveTo(playerScreenX, playerScreenY);
      
      const segments = 8;
      const dx = targetScreenX - playerScreenX;
      const dy = targetScreenY - playerScreenY;
      
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        const x = playerScreenX + dx * t + (i < segments ? offsetX : 0);
        const y = playerScreenY + dy * t + (i < segments ? offsetY : 0);
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffff00";
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(targetScreenX, targetScreenY, 15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    if (effect.chains) {
      effect.chains.forEach((chain) => {
        const fromScreenX = chain.from.x - camera.x;
        const fromScreenY = chain.from.y - camera.y;
        const toScreenX = chain.to.x - camera.x;
        const toScreenY = chain.to.y - camera.y;

        ctx.beginPath();
        ctx.moveTo(fromScreenX, fromScreenY);

        const segments = 6;
        const dx = toScreenX - fromScreenX;
        const dy = toScreenY - fromScreenY;

        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const offsetX = (Math.random() - 0.5) * 15;
          const offsetY = (Math.random() - 0.5) * 15;
          const x = fromScreenX + dx * t + (i < segments ? offsetX : 0);
          const y = fromScreenY + dy * t + (i < segments ? offsetY : 0);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00ffff";
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(toScreenX, toScreenY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
        ctx.fill();
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
  });

  gameState.projectiles.forEach((projectile) => {
    const screenX = projectile.position.x - camera.x;
    const screenY = projectile.position.y - camera.y;

    ctx.beginPath();
    ctx.arc(screenX, screenY, projectile.radius, 0, Math.PI * 2);
    
    if (projectile.elements.length === 0) {
      ctx.fillStyle = "#ff6b35";
      ctx.strokeStyle = "#ff8c42";
    } else if (projectile.elements.length === 1) {
      switch (projectile.elements[0]) {
        case SkillElement.FIRE:
          ctx.fillStyle = "#ff4500";
          ctx.strokeStyle = "#ff6b35";
          break;
        case SkillElement.ICE:
          ctx.fillStyle = "#00bfff";
          ctx.strokeStyle = "#87ceeb";
          break;
        case SkillElement.LIGHTNING:
          ctx.fillStyle = "#ffff00";
          ctx.strokeStyle = "#ffd700";
          break;
        case SkillElement.WATER:
          ctx.fillStyle = "#1e90ff";
          ctx.strokeStyle = "#4169e1";
          break;
      }
    } else {
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, projectile.radius);
      const colors = projectile.elements.map(elem => {
        switch (elem) {
          case SkillElement.FIRE: return "#ff4500";
          case SkillElement.ICE: return "#00bfff";
          case SkillElement.LIGHTNING: return "#ffff00";
          case SkillElement.WATER: return "#1e90ff";
          default: return "#ff6b35";
        }
      });
      
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = "#ffffff";
    }
    
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  gameState.orbiting.forEach((orb) => {
    const screenX = orb.position.x - camera.x;
    const screenY = orb.position.y - camera.y;

    ctx.beginPath();
    ctx.arc(screenX, screenY, orb.radius, 0, Math.PI * 2);
    
    if (orb.elements.length === 0) {
      ctx.fillStyle = "#9d4edd";
      ctx.strokeStyle = "#c77dff";
    } else if (orb.elements.length === 1) {
      switch (orb.elements[0]) {
        case SkillElement.FIRE:
          ctx.fillStyle = "#ff4500";
          ctx.strokeStyle = "#ff6b35";
          break;
        case SkillElement.ICE:
          ctx.fillStyle = "#00bfff";
          ctx.strokeStyle = "#87ceeb";
          break;
        case SkillElement.LIGHTNING:
          ctx.fillStyle = "#ffff00";
          ctx.strokeStyle = "#ffd700";
          break;
        case SkillElement.WATER:
          ctx.fillStyle = "#1e90ff";
          ctx.strokeStyle = "#4169e1";
          break;
      }
    } else {
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, orb.radius);
      const colors = orb.elements.map(elem => {
        switch (elem) {
          case SkillElement.FIRE: return "#ff4500";
          case SkillElement.ICE: return "#00bfff";
          case SkillElement.LIGHTNING: return "#ffff00";
          case SkillElement.WATER: return "#1e90ff";
          default: return "#9d4edd";
        }
      });
      
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = "#ffffff";
    }
    
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  gameState.enemies.forEach((enemy) => {
    const screenX = enemy.position.x - camera.x;
    const screenY = enemy.position.y - camera.y;

    const isBurning = enemy.burningDuration && gameState.gameTime < enemy.burningDuration;
    const isSlowed = enemy.slowedUntil && gameState.gameTime < enemy.slowedUntil;

    ctx.beginPath();
    ctx.arc(screenX, screenY, enemy.radius, 0, Math.PI * 2);

    switch (enemy.type) {
      case EnemyType.ZOMBIE:
        ctx.fillStyle = "#2d6a4f";
        break;
      case EnemyType.GHOST:
        ctx.fillStyle = "#8338ec";
        break;
      case EnemyType.DEMON:
        ctx.fillStyle = "#c1121f";
        break;
    }

    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (isBurning) {
      ctx.beginPath();
      ctx.arc(screenX, screenY, enemy.radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#ff4500";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (isSlowed) {
      ctx.beginPath();
      ctx.arc(screenX, screenY, enemy.radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#00bfff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const healthBarWidth = enemy.radius * 2;
    const healthBarHeight = 4;
    const healthPercent = enemy.health / enemy.maxHealth;

    ctx.fillStyle = "#000";
    ctx.fillRect(
      screenX - healthBarWidth / 2,
      screenY - enemy.radius - 10,
      healthBarWidth,
      healthBarHeight
    );

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(
      screenX - healthBarWidth / 2,
      screenY - enemy.radius - 10,
      healthBarWidth * healthPercent,
      healthBarHeight
    );
  });

  const playerScreenX = gameState.player.position.x - camera.x;
  const playerScreenY = gameState.player.position.y - camera.y;

  ctx.beginPath();
  ctx.arc(playerScreenX, playerScreenY, gameState.player.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#4cc9f0";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    playerScreenX,
    playerScreenY - 3,
    gameState.player.radius / 3,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Draw other players (multiplayer)
  if (otherPlayers && otherPlayers.size > 0) {
    otherPlayers.forEach((player) => {
      const otherX = player.position.x - camera.x;
      const otherY = player.position.y - camera.y;

      // Check if player is on screen
      const isOnScreen = otherX >= -50 && otherX <= width + 50 && otherY >= -50 && otherY <= height + 50;

      if (isOnScreen) {
        // Draw player circle
        ctx.beginPath();
        ctx.arc(otherX, otherY, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6b6b";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw player name
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;
        ctx.fillText(player.name, otherX, otherY - 30);
        ctx.shadowBlur = 0;

        // Draw health bar
        const barWidth = 40;
        const barHeight = 5;
        const healthPercent = Math.max(0, Math.min(1, player.health / 100));
        
        ctx.fillStyle = "#333";
        ctx.fillRect(otherX - barWidth / 2, otherY - 40, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.2 ? "#ffaa00" : "#ff0000";
        ctx.fillRect(otherX - barWidth / 2, otherY - 40, barWidth * healthPercent, barHeight);

        // Draw level badge
        ctx.fillStyle = "#7c3aed";
        ctx.beginPath();
        ctx.arc(otherX + 15, otherY - 15, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(player.level.toString(), otherX + 15, otherY - 15);
        ctx.textBaseline = "alphabetic";
      } else {
        // Draw off-screen indicator
        const dx = player.position.x - (camera.x + width / 2);
        const dy = player.position.y - (camera.y + height / 2);
        const angle = Math.atan2(dy, dx);
        
        // Calculate position at edge of screen
        const margin = 40;
        let indicatorX: number;
        let indicatorY: number;
        
        // Calculate intersection with screen edges
        const screenCenterX = width / 2;
        const screenCenterY = height / 2;
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Check which edge the indicator should be on
        const slopeToEdge = sin / cos;
        const slopeToTop = (0 - screenCenterY + margin) / (cos * 1000);
        const slopeToBottom = (height - screenCenterY - margin) / (cos * 1000);
        const slopeToLeft = (0 - screenCenterX + margin) / (sin * 1000);
        const slopeToRight = (width - screenCenterX - margin) / (sin * 1000);
        
        if (Math.abs(dx) / (width / 2) > Math.abs(dy) / (height / 2)) {
          // Hit left or right edge
          if (dx > 0) {
            indicatorX = width - margin;
            indicatorY = screenCenterY + (width / 2 - margin) * Math.tan(angle);
          } else {
            indicatorX = margin;
            indicatorY = screenCenterY - (width / 2 - margin) * Math.tan(angle);
          }
          indicatorY = Math.max(margin, Math.min(height - margin, indicatorY));
        } else {
          // Hit top or bottom edge
          if (dy > 0) {
            indicatorY = height - margin;
            indicatorX = screenCenterX + (height / 2 - margin) / Math.tan(angle);
          } else {
            indicatorY = margin;
            indicatorX = screenCenterX - (height / 2 - margin) / Math.tan(angle);
          }
          indicatorX = Math.max(margin, Math.min(width - margin, indicatorX));
        }
        
        // Draw indicator arrow
        ctx.save();
        ctx.translate(indicatorX, indicatorY);
        ctx.rotate(angle);
        
        // Arrow shape
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, -10);
        ctx.lineTo(-8, 10);
        ctx.closePath();
        
        ctx.fillStyle = "#ff6b6b";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Player name badge
        ctx.rotate(-angle);
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.fillRect(-25, -18, 50, 14);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(-25, -18, 50, 14);
        ctx.fillStyle = "#fff";
        ctx.fillText(player.name, 0, -11);
        
        ctx.restore();
        
        // Distance text
        const distance = Math.sqrt(dx * dx + dy * dy);
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillRect(indicatorX - 20, indicatorY + 15, 40, 12);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(indicatorX - 20, indicatorY + 15, 40, 12);
        ctx.fillStyle = "#ffaa00";
        ctx.fillText(Math.round(distance) + "m", indicatorX, indicatorY + 21);
      }
    });
  }
}
