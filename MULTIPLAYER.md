# Multiplayer Guide

## How to Play Multiplayer

### Starting the Game Server

1. Make sure dependencies are installed:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

### Creating a Party

1. Click **"MULTIPLAYER"** on the main menu
2. Click **"Create Party"**
3. Enter your player name
4. Share the **6-character party code** with your friends
5. Wait for players to join (up to 4 players total)
6. As the host, click **"Start Game"** when ready

### Joining a Party

1. Click **"MULTIPLAYER"** on the main menu
2. Click **"Join Party"**
3. Enter your player name
4. Enter the **party code** shared by the host
5. Wait for the host to start the game

## Multiplayer Features

### Player Synchronization
- All players see each other in real-time
- Player positions update 20 times per second
- Each player has their own camera that follows them
- Player names and health bars are displayed above characters

### Visual Indicators
- **Your Character**: Blue circle with white glow
- **Other Players**: Red circles with white outline
- **Player Names**: Displayed above each character
- **Health Bars**: Show current health status
- **Level Badges**: Purple circle showing player level

### Gameplay
- Each player controls their own character independently
- Enemies are shared across all players
- Each player gains their own XP and levels up individually
- Skills and upgrades are per-player
- The host manages enemy spawning for all players

### Controls (Same as Solo)
- **WASD** - Move your character
- **TAB** - Toggle stats panel
- **Backtick (`)** - Toggle debug menu

## Technical Details

### Architecture
- WebSocket server using Socket.io for real-time communication
- Custom Next.js server handling both HTTP and WebSocket connections
- Party system with unique 6-character codes
- Host-based enemy spawning to reduce server load

### Party System
- Maximum 4 players per party
- First player in party becomes the host
- Host migration if original host disconnects
- Parties automatically deleted when empty

### Network Update Rate
- Player positions: 50ms (20 updates/second)
- Enemy positions: Broadcast by host as they update
- Instant notifications for player join/leave events

## Troubleshooting

### Cannot connect to server
- Make sure the server is running (`npm run dev`)
- Check that port 3000 is not blocked by firewall
- Try accessing `http://localhost:3000` in your browser

### Party code not working
- Codes are case-insensitive (auto-capitalized)
- Codes are 6 characters long
- Make sure the party hasn't started yet
- Verify the code was entered correctly

### Players not appearing
- Check browser console for errors
- Refresh the page and reconnect
- Make sure all players are in the same party
- Verify the game has been started by the host

### Lag or delays
- Check your internet connection
- Reduce distance between players and server
- Close other network-intensive applications
- The host's connection affects all players

## Future Enhancements

Potential features to add:
- Chat system between players
- Shared XP and cooperative leveling
- Player revival mechanics
- Friendly fire toggle
- Spectator mode for dead players
- Leaderboards and statistics
- Custom player colors/avatars
- Private parties with passwords
