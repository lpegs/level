import { useEffect, useRef, useState } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import LevelUpModal from "./LevelUpModal";
import StatsPanel from "./StatsPanel";
import DebugMenu from "./DebugMenu";
import GameOverModal from "./GameOverModal";
import { GameState, Player, Enemy, Skill, SkillType, SkillElement, EnemyType, Projectile } from "@/types/game";
import { useGameLoop } from "@/hooks/useGameLoop";
import { usePlayerControls } from "@/hooks/usePlayerControls";
import { getSocket } from "@/lib/socket";
import { CharacterType, CHARACTERS } from "@/types/characters";

const getCanvasSize = () => {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

const initialPlayer: Player = {
  position: { x: 600, y: 400 },
  velocity: { x: 0, y: 0 },
  radius: 15,
  health: 100,
  maxHealth: 100,
  speed: 200,
  xp: 0,
  level: 1,
  xpToNextLevel: 10,
  skills: [
    {
      id: "fireball",
      name: "Fireball",
      description: "Auto-shoots fireballs at nearest enemies every 1.5s.",
      level: 1,
      cooldown: 1.5,
      currentCooldown: 0,
      type: SkillType.FIREBALL,
      elements: [],
    },
  ],
};

const initialSkills: Skill[] = [
  {
    id: "fireball",
    name: "Fireball",
    description: "Auto-shoots fireballs at nearest enemies every 1.5s.",
    level: 0,
    cooldown: 1.5,
    currentCooldown: 0,
    type: SkillType.FIREBALL,
    elements: [],
  },
  {
    id: "lightning",
    name: "Lightning Strike",
    description: "Auto-strikes random enemies with lightning every 2s.",
    level: 0,
    cooldown: 2.0,
    currentCooldown: 0,
    type: SkillType.LIGHTNING,
    elements: [],
  },
  {
    id: "orbit",
    name: "Magic Orbit",
    description: "Magical orbs constantly orbit around you, damaging enemies.",
    level: 0,
    cooldown: 0,
    currentCooldown: 0,
    type: SkillType.ORBIT,
    elements: [],
  },
];

interface GameProps {
  onMainMenu?: () => void;
  partyCode?: string;
  initialIsHost?: boolean;
  selectedCharacter?: CharacterType;
}

export default function Game({ onMainMenu, partyCode, initialIsHost, selectedCharacter = 'warrior' }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(getCanvasSize());
  const [showStats, setShowStats] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [otherPlayers, setOtherPlayers] = useState<Map<string, any>>(new Map());
  const [isHost, setIsHost] = useState(initialIsHost || false);
  const [multiplayerReady, setMultiplayerReady] = useState(false);

  useEffect(() => {
    if (initialIsHost !== undefined) {
      setIsHost(initialIsHost);
      console.log(`🎯 Role set from initial: ${initialIsHost ? 'HOST' : 'CLIENT'}`);
    }
  }, [initialIsHost]);
  
  // Get starting skill based on selected character
  const getStartingSkill = (): Skill => {
    const character = CHARACTERS.find(c => c.id === selectedCharacter);
    const skillType = character?.startingSkill || 'fireball';
    
    const skillMap: Record<string, Skill> = {
      fireball: {
        id: "fireball",
        name: "Fireball",
        description: "Auto-shoots fireballs at nearest enemies every 1.5s.",
        level: 1,
        cooldown: 1.5,
        currentCooldown: 0,
        type: SkillType.FIREBALL,
        elements: [],
      },
      lightning: {
        id: "lightning",
        name: "Lightning Strike",
        description: "Auto-strikes random enemies with lightning every 2s.",
        level: 1,
        cooldown: 2.0,
        currentCooldown: 0,
        type: SkillType.LIGHTNING,
        elements: [],
      },
      orbit: {
        id: "orbit",
        name: "Magic Orbit",
        description: "Magical orbs constantly orbit around you, damaging enemies.",
        level: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: SkillType.ORBIT,
        elements: [],
      },
    };

    return skillMap[skillType];
  };

  const [gameState, setGameState] = useState<GameState>({
    player: {
      ...initialPlayer,
      position: { x: 0, y: 0 },
      skills: [getStartingSkill()],
    },
    camera: { x: 0, y: 0 },
    enemies: [],
    projectiles: [],
    orbiting: [],
    lightningEffects: [],
    spawnTimer: 0,
    gameTime: 0,
    isPaused: false,
    isLevelingUp: false,
    availableSkills: initialSkills,
  });

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getCanvasSize());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setShowStats((prev) => !prev);
      }
      if (e.key === "`" || e.key === "~" || e.key === "Control") {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const keys = usePlayerControls();

  useEffect(() => {
    if (!partyCode) {
      setMultiplayerReady(true);
      return;
    }

    const socket = getSocket();
    
    if (!socket.connected) {
      socket.connect();
    }

    console.log(`🌐 Multiplayer mode for party: ${partyCode}`);

    // Request initial player states
    socket.emit("requestPlayerStates", (response: any) => {
      if (response.success && response.players.length > 0) {
        console.log(`✅ Loaded ${response.players.length} other player(s)`);
        setOtherPlayers((prev) => {
          const updated = new Map(prev);
          response.players.forEach((player: any) => {
            updated.set(player.id, {
              name: player.name,
              position: player.position,
              health: player.health,
              level: player.level,
              skills: player.skills,
              lastUpdate: Date.now(),
            });
          });
          return updated;
        });
      }
      setMultiplayerReady(true);
    });

    socket.on("playerUpdate", (data: any) => {
      setOtherPlayers((prev) => {
        const updated = new Map(prev);
        updated.set(data.id, {
          name: data.name,
          position: data.position,
          health: data.health,
          level: data.level,
          skills: data.skills,
          lastUpdate: Date.now(),
        });
        return updated;
      });
    });

    socket.on("playerDisconnected", (playerId: string) => {
      setOtherPlayers((prev) => {
        const updated = new Map(prev);
        updated.delete(playerId);
        return updated;
      });
    });

    // Receive shared XP from other players
    socket.on("receiveXP", (xpData: any) => {
      console.log(`💎 Received ${xpData.amount} XP from ${xpData.fromPlayer}`);
      setGameState((prev) => ({
        ...prev,
        player: {
          ...prev.player,
          xp: prev.player.xp + xpData.amount,
        },
      }));
    });

    // Non-host clients receive game state ticks from server
    socket.on("gameStateTick", (update: any) => {
      console.log("📦 Received game state:", update.enemies?.length, "enemies");
      if (!isHost) {
        // Merge received data with local state
        setGameState((prev) => {
          // Keep existing enemy properties that aren't synced
          const updatedEnemies = (update.enemies || []).map((networkEnemy: any) => {
            const existingEnemy = prev.enemies.find(e => e.id === networkEnemy.id);
            return {
              ...networkEnemy,
              velocity: existingEnemy?.velocity || { x: 0, y: 0 },
              speed: existingEnemy?.speed || 80,
              damage: existingEnemy?.damage || 10,
              xpValue: existingEnemy?.xpValue || 2,
              isBurning: existingEnemy?.isBurning,
              burnEndTime: existingEnemy?.burnEndTime,
              isSlowed: existingEnemy?.isSlowed,
              slowEndTime: existingEnemy?.slowEndTime,
            };
          });

          console.log("✅ Updated enemies:", updatedEnemies.length);

          return {
            ...prev,
            enemies: updatedEnemies,
            gameTime: update.gameTime || prev.gameTime,
          };
        });
      }
    });

    // Send player updates
    const updateInterval = setInterval(() => {
      if (!gameState.isPaused) {
        socket.emit("playerUpdate", {
          position: gameState.player.position,
          health: gameState.player.health,
          level: gameState.player.level,
          skills: gameState.player.skills,
        });
      }
    }, 50);

    // Host sends game state updates to server (reduced frequency)
    let gameStateInterval: NodeJS.Timeout | undefined;
    if (isHost && multiplayerReady) {
      console.log("👑 HOST: Starting game state broadcaster");
      gameStateInterval = setInterval(() => {
        if (!gameState.isPaused) {
          const enemyData = gameState.enemies.map(e => ({
            id: e.id,
            position: { x: Math.round(e.position.x), y: Math.round(e.position.y) },
            health: Math.round(e.health),
            maxHealth: e.maxHealth,
            type: e.type,
            radius: e.radius,
            speed: e.speed,
            damage: e.damage,
            xpValue: e.xpValue,
          }));
          
          console.log("📤 HOST sending:", enemyData.length, "enemies");
          
          // Send minimal data - only essential properties
          socket.emit("hostGameState", {
            enemies: enemyData,
            gameTime: Math.round(gameState.gameTime * 10) / 10,
          });
        }
      }, 100); // Send every 100ms instead of 50ms
    }

    // Clean up stale players (haven't updated in 5 seconds)
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setOtherPlayers((prev) => {
        const updated = new Map(prev);
        let hasChanges = false;
        
        updated.forEach((player, id) => {
          if (now - player.lastUpdate > 5000) {
            updated.delete(id);
            hasChanges = true;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => {
      socket.off("playerUpdate");
      socket.off("playerDisconnected");
      socket.off("gameStateTick");
      socket.off("receiveXP");
      clearInterval(updateInterval);
      if (gameStateInterval) clearInterval(gameStateInterval);
      clearInterval(cleanupInterval);
    };
  }, [partyCode, isHost, multiplayerReady, gameState.isPaused, gameState.player, gameState.enemies, gameState.gameTime]);

  const handleXPGained = (amount: number) => {
    if (!partyCode) return;
    const socket = getSocket();
    socket.emit("shareXP", { amount });
  };

  useGameLoop(
    canvasRef, 
    gameState, 
    setGameState, 
    keys, 
    canvasSize.width, 
    canvasSize.height, 
    () => setIsGameOver(true),
    otherPlayers, 
    partyCode ? isHost : true,
    partyCode ? handleXPGained : undefined
  );

  const handleSkillSelect = (skill: Skill, enhancement?: { type: 'element' | 'count', value?: SkillElement }) => {
    setGameState((prev) => {
      const playerSkills = [...prev.player.skills];
      const skillIndex = playerSkills.findIndex((s) => s.id === skill.id);

      if (skillIndex >= 0) {
        const currentSkill = playerSkills[skillIndex];
        const newLevel = currentSkill.level + 1;
        
        let newElements = [...currentSkill.elements];
        if (enhancement?.type === 'element' && enhancement.value && enhancement.value !== SkillElement.NONE) {
          if (!newElements.includes(enhancement.value)) {
            newElements.push(enhancement.value);
          }
        }
        
        playerSkills[skillIndex] = {
          ...currentSkill,
          level: newLevel,
          elements: newElements,
        };
      } else {
        playerSkills.push({ ...skill, level: 1 });
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          skills: playerSkills,
        },
        isPaused: false,
        isLevelingUp: false,
      };
    });
  };

  const handleDebugLevelUp = () => {
    setGameState((prev) => ({
      ...prev,
      isLevelingUp: true,
      isPaused: true,
    }));
  };

  const handleDebugAddXP = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        xp: prev.player.xp + amount,
      },
    }));
  };

  const handleDebugHeal = () => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        health: prev.player.maxHealth,
      },
    }));
  };

  const handleDebugSpawnEnemies = (count: number) => {
    setGameState((prev) => {
      const newEnemies: Enemy[] = [];
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const distance = 200 + Math.random() * 100;
        const position = {
          x: prev.player.position.x + Math.cos(angle) * distance,
          y: prev.player.position.y + Math.sin(angle) * distance,
        };

        const types = [EnemyType.ZOMBIE, EnemyType.GHOST, EnemyType.DEMON];
        const type = types[Math.floor(Math.random() * types.length)];

        const healthMultiplier = 1 + (prev.player.level - 1) * 0.15;
        const baseHealth = type === EnemyType.DEMON ? 30 : type === EnemyType.GHOST ? 15 : 10;
        const scaledHealth = Math.floor(baseHealth * healthMultiplier);

        newEnemies.push({
          position,
          velocity: { x: 0, y: 0 },
          radius: type === EnemyType.DEMON ? 20 : 12,
          health: scaledHealth,
          maxHealth: scaledHealth,
          speed: type === EnemyType.GHOST ? 100 : type === EnemyType.DEMON ? 60 : 80,
          damage: type === EnemyType.DEMON ? 15 : type === EnemyType.GHOST ? 8 : 10,
          xpValue: type === EnemyType.DEMON ? 5 : type === EnemyType.GHOST ? 3 : 2,
          type,
        });
      }

      return {
        ...prev,
        enemies: [...prev.enemies, ...newEnemies],
      };
    });
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setGameState({
      player: {
        ...initialPlayer,
        position: { x: 0, y: 0 },
      },
      camera: { x: 0, y: 0 },
      enemies: [],
      projectiles: [],
      orbiting: [],
      lightningEffects: [],
      spawnTimer: 0,
      gameTime: 0,
      isPaused: false,
      isLevelingUp: false,
      availableSkills: initialSkills,
    });
  };

  const handleMainMenu = () => {
    if (onMainMenu) {
      onMainMenu();
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden relative">
      <GameCanvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
      <GameUI gameState={gameState} showStatsHint={!showStats} playerCount={partyCode ? otherPlayers.size + 1 : undefined} />
      {showStats && <StatsPanel gameState={gameState} />}
      {showDebug && (
        <DebugMenu
          gameState={gameState}
          onLevelUp={handleDebugLevelUp}
          onAddXP={handleDebugAddXP}
          onHeal={handleDebugHeal}
          onSpawnEnemies={handleDebugSpawnEnemies}
          partyCode={partyCode}
          otherPlayersCount={otherPlayers.size}
          isHost={isHost}
        />
      )}
      {isGameOver && (
        <GameOverModal
          gameState={gameState}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
      {gameState.isLevelingUp && (
        <LevelUpModal
          availableSkills={gameState.availableSkills}
          playerSkills={gameState.player.skills}
          onSelectSkill={handleSkillSelect}
        />
      )}
    </div>
  );
}
