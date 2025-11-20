const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const parties = new Map();

function generatePartyCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

app.prepare().then(() => {
  const httpServer = createServer(handler);
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Game state loop - runs every 100ms (10 ticks per second) - reduced for less lag
  setInterval(() => {
    parties.forEach((party, code) => {
      if (!party.gameStarted || !party.sharedGameState) return;

      // Only broadcast to non-host clients (host already has the data)
      const nonHostPlayers = party.players.filter(p => p.id !== party.host);
      nonHostPlayers.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('gameStateTick', {
            enemies: party.sharedGameState.enemies || [],
            gameTime: party.sharedGameState.gameTime || 0,
          });
        }
      });
    });
  }, 100);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('createParty', (playerName, callback) => {
      const partyCode = generatePartyCode();
      
      parties.set(partyCode, {
        code: partyCode,
        host: socket.id,
        players: [{
          id: socket.id,
          name: playerName,
          position: { x: 0, y: 0 },
          health: 100,
          level: 1,
          isHost: true,
        }],
        gameStarted: false,
        gameState: null,
      });

      socket.join(partyCode);
      socket.partyCode = partyCode;
      socket.playerName = playerName;

      console.log(`Party created: ${partyCode} by ${playerName}`);
      
      callback({ success: true, partyCode, party: parties.get(partyCode) });
    });

    socket.on('joinParty', (data, callback) => {
      const { partyCode, playerName } = data;
      const party = parties.get(partyCode);

      if (!party) {
        callback({ success: false, error: 'Party not found' });
        return;
      }

      if (party.gameStarted) {
        callback({ success: false, error: 'Game already in progress' });
        return;
      }

      if (party.players.length >= 4) {
        callback({ success: false, error: 'Party is full' });
        return;
      }

      const newPlayer = {
        id: socket.id,
        name: playerName,
        position: { x: 0, y: 0 },
        health: 100,
        level: 1,
        isHost: false,
      };

      party.players.push(newPlayer);
      socket.join(partyCode);
      socket.partyCode = partyCode;
      socket.playerName = playerName;

      console.log(`${playerName} joined party: ${partyCode}`);

      io.to(partyCode).emit('partyUpdated', party);
      callback({ success: true, party });
    });

    socket.on('leaveParty', () => {
      if (!socket.partyCode) return;

      const party = parties.get(socket.partyCode);
      if (!party) return;

      party.players = party.players.filter(p => p.id !== socket.id);

      if (party.players.length === 0) {
        parties.delete(socket.partyCode);
        console.log(`Party ${socket.partyCode} deleted (empty)`);
      } else {
        if (party.host === socket.id && party.players.length > 0) {
          party.host = party.players[0].id;
          party.players[0].isHost = true;
        }
        io.to(socket.partyCode).emit('partyUpdated', party);
      }

      socket.leave(socket.partyCode);
      socket.partyCode = null;
    });

    socket.on('startGame', (callback) => {
      if (!socket.partyCode) {
        callback({ success: false, error: 'Not in a party' });
        return;
      }

      const party = parties.get(socket.partyCode);
      if (!party) {
        callback({ success: false, error: 'Party not found' });
        return;
      }

      if (party.host !== socket.id) {
        callback({ success: false, error: 'Only host can start game' });
        return;
      }

      party.gameStarted = true;
      
      // Initialize shared game state - host is authoritative
      party.sharedGameState = {
        enemies: [],
        gameTime: 0,
        lastUpdate: Date.now(),
      };
      
      // Initialize player states
      party.players.forEach(player => {
        player.position = { x: 0, y: 0 };
        player.health = 100;
        player.level = 1;
        player.skills = [];
      });

      // Notify all players, tell them who is host
      party.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('gameStarted', { 
            isHost: player.id === party.host 
          });
        }
      });
      
      callback({ success: true });
      
      console.log(`Game started in party ${socket.partyCode} with ${party.players.length} players (host: ${party.host})`);
    });

    socket.on('playerUpdate', (playerData) => {
      if (!socket.partyCode) return;

      const party = parties.get(socket.partyCode);
      if (!party || !party.gameStarted) return;

      const player = party.players.find(p => p.id === socket.id);
      if (player) {
        player.position = playerData.position;
        player.health = playerData.health;
        player.level = playerData.level;
        player.skills = playerData.skills;
      }

      // Broadcast to all OTHER players in the party
      socket.to(socket.partyCode).emit('playerUpdate', {
        id: socket.id,
        name: socket.playerName,
        ...playerData
      });
    });

    socket.on('requestPlayerStates', (callback) => {
      if (!socket.partyCode) {
        callback({ success: false, players: [] });
        return;
      }

      const party = parties.get(socket.partyCode);
      if (!party || !party.gameStarted) {
        callback({ success: false, players: [] });
        return;
      }

      // Send all OTHER players' states
      const otherPlayers = party.players
        .filter(p => p.id !== socket.id)
        .map(p => ({
          id: p.id,
          name: p.name,
          position: p.position || { x: 0, y: 0 },
          health: p.health || 100,
          level: p.level || 1,
          skills: p.skills || []
        }));

      callback({ success: true, players: otherPlayers });
    });

    // Only HOST sends game state updates
    socket.on('hostGameState', (gameStateUpdate) => {
      if (!socket.partyCode) return;
      
      const party = parties.get(socket.partyCode);
      if (!party || party.host !== socket.id) return;

      console.log(`📥 Received from HOST: ${gameStateUpdate.enemies?.length || 0} enemies`);

      // Update shared game state on server
      party.sharedGameState = {
        enemies: gameStateUpdate.enemies || [],
        gameTime: gameStateUpdate.gameTime || 0,
        lastUpdate: Date.now(),
      };
    });

    // XP sharing - when any player gains XP, share with all
    socket.on('shareXP', (xpData) => {
      if (!socket.partyCode) return;
      
      const party = parties.get(socket.partyCode);
      if (!party || !party.gameStarted) return;

      // Broadcast XP gain to all other players
      socket.to(socket.partyCode).emit('receiveXP', {
        amount: xpData.amount,
        fromPlayer: socket.playerName,
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (socket.partyCode) {
        const party = parties.get(socket.partyCode);
        if (party) {
          const disconnectedPlayer = party.players.find(p => p.id === socket.id);
          party.players = party.players.filter(p => p.id !== socket.id);

          // Notify other players about disconnection
          if (party.gameStarted) {
            socket.to(socket.partyCode).emit('playerDisconnected', socket.id);
          }

          if (party.players.length === 0) {
            parties.delete(socket.partyCode);
            console.log(`Party ${socket.partyCode} deleted (empty)`);
          } else {
            if (party.host === socket.id && party.players.length > 0) {
              party.host = party.players[0].id;
              party.players[0].isHost = true;
              console.log(`Host migrated to ${party.players[0].name} in party ${socket.partyCode}`);
            }
            io.to(socket.partyCode).emit('partyUpdated', party);
          }

          if (disconnectedPlayer) {
            console.log(`${disconnectedPlayer.name} left party: ${socket.partyCode}`);
          }
        }
      }
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
