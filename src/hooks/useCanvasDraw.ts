import { RefObject, useEffect } from "react";

export function useCanvasDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pixels: Record<string, string>,
  pixelSize: number,
  canvasWidth: number,
  canvasHeight: number
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth * pixelSize, canvasHeight * pixelSize);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasWidth * pixelSize, canvasHeight * pixelSize);

    // Draw pixels
    for (const key in pixels) {
      const [x, y] = key.split(",").map(Number);
      ctx.fillStyle = pixels[key];
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }

    // Grid lines
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvasWidth; x++) {
      const pos = x * pixelSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvasHeight * pixelSize);
      ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y++) {
      const pos = y * pixelSize;
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvasWidth * pixelSize, pos);
      ctx.stroke();
    }
  }, [pixels, canvasWidth, canvasHeight, pixelSize, canvasRef]);
}
