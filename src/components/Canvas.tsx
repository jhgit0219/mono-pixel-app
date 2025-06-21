"use client";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasStore } from "@/lib/state";

export default function Canvas() {
  const width = useCanvasStore((s) => s.canvasWidth);
  const height = useCanvasStore((s) => s.canvasHeight);
  const pixelSize = useCanvasStore((s) => s.pixelSize); // 🔥 pull from store

  const canvasRef = useCanvas({
    canvasWidth: width,
    canvasHeight: height,
    // no pixelSize: let useCanvas compute it dynamically
  });

  return (
    <canvas
      ref={canvasRef}
      width={width * pixelSize}
      height={height * pixelSize}
      style={{
        width: `${width * pixelSize}px`,
        height: `${height * pixelSize}px`,
        imageRendering: "pixelated",
      }}
      className="border border-black"
    />
  );
}
