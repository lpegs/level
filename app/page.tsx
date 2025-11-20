"use client";

import { useState, useEffect } from "react";
import Game from "@/components/Game";
import HomeScreen from "@/components/HomeScreen";
import AboutScreen from "@/components/AboutScreen";
import MultiplayerMenu from "@/components/MultiplayerMenu";
import PartyLobby from "@/components/PartyLobby";
import CharacterSelect from "@/components/CharacterSelect";
import { getSocket } from "@/lib/socket";
import { CharacterType } from "@/types/characters";

type Screen = "home" | "game" | "about" | "multiplayer" | "lobby" | "characterSelect" | "multiplayerCharacterSelect";

interface Party {
  code: string;
  host: string;
  players: Array<{
    id: string;
    name: string;
    level: number;
    health: number;
    isHost: boolean;
  }>;
  gameStarted: boolean;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [party, setParty] = useState<Party | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('warrior');

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on("connect", () => {
      setSocketId(socket.id || "");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("partyUpdated", (updatedParty: Party) => {
      setParty(updatedParty);
    });

    socket.on("gameStarted", (data: { isHost: boolean }) => {
      console.log("🎮 Game started! Role:", data.isHost ? "HOST" : "CLIENT");
      setIsHost(data.isHost);
      setCurrentScreen("game");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("partyUpdated");
      socket.off("gameStarted");
    };
  }, []);

  const handleCreateParty = (playerName: string) => {
    const socket = getSocket();
    
    const timeout = setTimeout(() => {
      setError("Connection timeout. Please try again.");
      setCurrentScreen("multiplayer");
    }, 5000);

    socket.emit("createParty", playerName, (response: any) => {
      clearTimeout(timeout);
      if (response.success) {
        setParty(response.party);
        setCurrentScreen("lobby");
        setError("");
      } else {
        setError("Failed to create party");
        setCurrentScreen("multiplayer");
      }
    });
  };

  const handleJoinParty = (partyCode: string, playerName: string) => {
    const socket = getSocket();
    
    const timeout = setTimeout(() => {
      setError("Connection timeout. Please try again.");
      setCurrentScreen("multiplayer");
    }, 5000);

    socket.emit("joinParty", { partyCode, playerName }, (response: any) => {
      clearTimeout(timeout);
      if (response.success) {
        setParty(response.party);
        setCurrentScreen("lobby");
        setError("");
      } else {
        setError(response.error || "Failed to join party");
        setCurrentScreen("multiplayer");
      }
    });
  };

  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit("startGame", (response: any) => {
      if (!response.success) {
        setError(response.error || "Failed to start game");
      }
    });
  };

  const handleLeaveParty = () => {
    const socket = getSocket();
    socket.emit("leaveParty");
    setParty(null);
    setCurrentScreen("multiplayer");
  };

  const handleBackToHome = () => {
    if (party) {
      handleLeaveParty();
    }
    setCurrentScreen("home");
    setSelectedCharacter('warrior');
  };

  if (currentScreen === "home") {
    return (
      <HomeScreen 
        onPlay={() => setCurrentScreen("characterSelect")} 
        onMultiplayer={() => setCurrentScreen("multiplayerCharacterSelect")}
        onAbout={() => setCurrentScreen("about")}
      />
    );
  }

  if (currentScreen === "about") {
    return <AboutScreen onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "characterSelect") {
    return (
      <CharacterSelect
        onSelect={(character) => {
          setSelectedCharacter(character);
          setCurrentScreen("game");
        }}
        onBack={() => setCurrentScreen("home")}
      />
    );
  }

  if (currentScreen === "multiplayerCharacterSelect") {
    return (
      <CharacterSelect
        onSelect={(character) => {
          setSelectedCharacter(character);
          setCurrentScreen("multiplayer");
        }}
        onBack={() => setCurrentScreen("home")}
      />
    );
  }

  if (currentScreen === "multiplayer") {
    return (
      <MultiplayerMenu
        onBack={handleBackToHome}
        onCreateParty={handleCreateParty}
        onJoinParty={handleJoinParty}
        isConnected={isConnected}
      />
    );
  }

  if (currentScreen === "lobby" && party) {
    return (
      <PartyLobby
        party={party}
        currentPlayerId={socketId}
        onStartGame={handleStartGame}
        onLeaveParty={handleLeaveParty}
      />
    );
  }

  return (
    <Game 
      onMainMenu={handleBackToHome} 
      partyCode={party?.code} 
      initialIsHost={isHost}
      selectedCharacter={selectedCharacter}
    />
  );
}
