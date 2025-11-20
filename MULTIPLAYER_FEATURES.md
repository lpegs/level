# Multiplayer Features & Refinements

## 🎮 Overview
This game now features **real-time multiplayer** with up to 4 players per party using WebSocket connections (Socket.io).

---

## ✨ Key Features

### **1. Party System**
- **Unique 6-character party codes** (alphanumeric, auto-uppercase)
- Up to **4 players** per party
- **Host-based system** - first player is automatically the host
- **Host migration** - if host leaves, next player becomes host
- **Real-time lobby updates** when players join/leave

### **2. Player Synchronization**
- **20 updates per second** (50ms interval) for smooth movement
- Player position, health, level, and skills synchronized
- **Automatic cleanup** of disconnected players (5-second timeout)
- **Pause-aware** - no updates sent while game is paused

### **3. Visual Indicators**
#### On-Screen Players:
- **Red circles** with white outline
- Player **names** displayed above characters
- **Health bars** (color-coded: green/yellow/red)
- **Level badges** showing player level
- Smooth animations and shadows

#### Off-Screen Players:
- **Arrow indicators** at screen edges pointing toward players
- **Player name badges** on arrows
- **Distance display** showing how far away (in meters)
- Arrows positioned at nearest screen edge

### **4. Connection Management**
- **Connection status indicator** (green = connected, red = disconnected)
- **Timeout handling** (5 seconds) for party operations
- **Automatic reconnection** support
- **Stale player cleanup** removes inactive players after 5 seconds

### **5. Enhanced Lobby UI**
- **Animated player cards** with slide-in effect
- **Empty slot indicators** showing available spots
- **Color-coded avatars** (purple/pink for you, blue/cyan for others)
- **Host indicators** with crown icon
- **Status messages** ("Can start the game" / "Waiting for host")
- **Player count display** in top-right corner during gameplay

### **6. Input Validation**
- Name must be **at least 2 characters**
- Party code must be **exactly 6 characters**
- **Alphanumeric only** for party codes
- **Real-time error messages** with icons
- **Loading states** on buttons ("Creating..." / "Joining...")

### **7. Error Handling**
- User-friendly error messages
- **Connection timeouts** with automatic fallback
- **Party not found** handling
- **Game already started** prevention
- **Party full** detection
- **Animated error badges** with pulse effect

---

## 🎯 User Flow

### Creating a Party:
1. Click **"MULTIPLAYER"** → **"Create Party"**
2. Enter your name (2+ characters)
3. Party code is generated automatically
4. Share the code with friends
5. Wait for players to join (see them appear in real-time)
6. Click **"Start Game"** when ready (host only)

### Joining a Party:
1. Click **"MULTIPLAYER"** → **"Join Party"**
2. Enter your name (2+ characters)
3. Enter the 6-character party code
4. You'll see all players in the lobby
5. Wait for host to start the game

### In-Game:
- Move independently with **WASD**
- See other players as **red circles** with names
- **Off-screen arrows** show where teammates are
- **Player count** displayed in top-right (e.g., "👥 3 Players")
- Each player levels up and picks skills independently
- Enemies are shared across all players

---

## 🔧 Technical Details

### Architecture:
- **WebSocket Server**: Custom Next.js server with Socket.io
- **Update Rate**: 50ms (20 times per second)
- **Cleanup Interval**: 1 second for stale player detection
- **Network Protocol**: Socket.io events (playerUpdate, enemiesUpdate, etc.)

### Performance Optimizations:
- **Pause detection** - no updates while paused (leveling up, game over)
- **Efficient state updates** - only changed data sent
- **Stale player cleanup** - automatic memory management
- **Smart rendering** - off-screen indicators instead of always rendering all players

### Event System:
- `createParty` - Generate new party with unique code
- `joinParty` - Join existing party by code
- `leaveParty` - Remove player from party
- `startGame` - Host initiates game start
- `playerUpdate` - Broadcast player position/stats (20Hz)
- `enemiesUpdate` - Host broadcasts enemy positions
- `playerDisconnected` - Notify when player leaves
- `partyUpdated` - Notify lobby of member changes

### Security Considerations:
- Party codes are **server-generated** (no client manipulation)
- **Host validation** for game start
- **Player count limits** enforced server-side
- **Disconnect handling** prevents ghost players

---

## 🎨 UI/UX Enhancements

### Animations:
- **Slide-in effect** for lobby player cards (staggered)
- **Pulse animation** for connection status
- **Smooth transitions** for all buttons and cards

### Color Coding:
- **Purple/Pink** - Your character and UI elements
- **Blue/Cyan** - Other players
- **Green** - Connected status, high health
- **Yellow** - Host crown, medium health
- **Red** - Disconnected status, low health, enemies

### Accessibility:
- **Clear status indicators** with colors AND icons
- **Loading states** so users know operations are in progress
- **Error messages** with specific guidance
- **Keyboard-friendly** inputs with proper focus states

---

## 🐛 Debug Features

Press **CTRL** or **`** to toggle debug menu for:
- Instant level up
- Add XP
- Heal to full
- Spawn enemies
- View all stats

---

## 📊 Lobby Information Display

### Player Cards Show:
- Player avatar (first letter of name)
- Player name
- "You" badge for yourself
- Host crown for party leader
- Status text (what they're doing)

### Empty Slots Show:
- Dashed border with "?" avatar
- "Waiting for player..." text
- Visual indication of available spots

---

## 🚀 Future Enhancement Ideas

Potential additions:
- **Voice chat integration**
- **Team colors/custom avatars**
- **Private parties with passwords**
- **Spectator mode**
- **Player revival mechanics**
- **Shared XP pool option**
- **Friend list/recent players**
- **In-game chat system**
- **Ping/latency display**
- **Region selection**
- **Replay system**
- **Statistics and leaderboards**

---

## 🎮 Controls

### During Game:
- **WASD** - Move character
- **TAB** - Toggle stats panel
- **CTRL** or **`** - Toggle debug menu

### Menus:
- **Click buttons** to navigate
- **Type** in input fields
- **ESC** or **Back button** to return

---

## 💡 Tips for Best Experience

1. **Share party codes carefully** - they're case-insensitive but must be exact
2. **Host should wait** for all players before starting
3. **Stay connected** - disconnects are handled but may interrupt gameplay
4. **Use arrows** to find teammates when spread out
5. **Coordinate levels** - different skill combinations work better together
6. **Watch player count** - know how many teammates you have at a glance

---

## 🔍 Troubleshooting

**Can't connect?**
- Check connection status indicator (should be green)
- Refresh the page
- Verify server is running on port 3000

**Party code not working?**
- Codes are case-insensitive
- Must be exactly 6 characters
- Check for typos
- Code may expire if party is deleted

**Players not appearing?**
- Check if they're off-screen (look for arrows)
- Verify they successfully joined the party
- Wait a few seconds for sync

**Host can't start game?**
- Verify you're actually the host (crown icon)
- Check if game already started
- Try leaving and recreating party

---

*Enjoy playing with friends! 🎉*
