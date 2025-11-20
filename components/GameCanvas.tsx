import { forwardRef } from "react";

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width, height }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className="absolute top-0 left-0"
      />
    );
  }
);

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
