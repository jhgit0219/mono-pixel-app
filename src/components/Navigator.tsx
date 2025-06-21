"use client";
import { useEffect, useRef } from "react";
import { useCanvasStore } from "@/lib/state";

export default function Navigator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixels = useCanvasStore((s) => s.pixels);
  const canvasWidth = useCanvasStore((s) => s.canvasWidth);
  const canvasHeight = useCanvasStore((s) => s.canvasHeight);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const displayWidth = canvas.offsetWidth;
    const displayHeight = canvas.offsetHeight;

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.imageRendering = "pixelated";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = displayWidth / canvasWidth;
    const scaleY = displayHeight / canvasHeight;

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    for (const key in pixels) {
      const [x, y] = key.split(",").map(Number);
      ctx.fillStyle = pixels[key];
      ctx.fillRect(x * scaleX, y * scaleY, scaleX, scaleY);
    }
  }, [pixels, canvasWidth, canvasHeight]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
