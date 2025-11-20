# Vampire Survivors Clone

A roguelike game inspired by Vampire Survivors, built with Next.js and TypeScript.

## Features

- **Character Movement**: Control your character using WASD keys
- **Enemy System**: Multiple enemy types (Zombies, Ghosts, Demons) with different behaviors
- **XP & Leveling**: Gain experience by killing enemies and level up
- **3 Unique Skills**:
  - **Fireball**: Auto-fires projectiles at the nearest enemies
  - **Lightning Strike**: Randomly strikes multiple enemies with devastating lightning
  - **Magic Orbit**: Spinning orbs orbit around you, damaging nearby enemies
- **Skill Progression**: Level up skills to increase their power
- **Real-time Combat**: Dynamic collision detection and damage system

## How to Play

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Controls

- **W/A/S/D**: Move your character
- **Level Up**: When you level up, the game pauses and you can choose a skill to unlock or upgrade

## Game Mechanics

- Kill enemies to gain XP
- Each level lets you choose a new skill or upgrade an existing one
- Skills have different mechanics:
  - **Fireball** shoots projectiles that can pierce through enemies at higher levels
  - **Lightning** instantly damages random enemies without projectiles
  - **Magic Orbit** creates a protective circle of orbs around your character
- Enemies spawn continuously and chase after you
- Different enemy types have varying health, speed, and damage
- Survive as long as you can!

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Important**: For multiplayer functionality in production, you may need to deploy the Socket.IO server separately (see DEPLOYMENT.md).

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Canvas API for rendering
- Socket.IO (for multiplayer)

## Project Structure

```
vampire-survivors-game/
├── app/                  # Next.js app directory
├── components/           # React components
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Game logic utilities
    ├── player.ts        # Player movement and controls
    ├── enemies.ts       # Enemy spawning and AI
    ├── skills.ts        # Skill mechanics
    ├── projectiles.ts   # Projectile physics
    ├── collision.ts     # Collision detection
    └── render.ts        # Canvas rendering
```
