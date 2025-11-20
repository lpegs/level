import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEVEL - Roguelike Survival Game",
  description: "Survive endless waves of enemies, level up, and unlock powerful abilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
