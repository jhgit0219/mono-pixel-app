"use client";
import { useRef } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasStore } from "@/lib/state";
import { useCanvasPan } from "@/hooks/useCanvasPan";

export default function Canvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const width = useCanvasStore((s) => s.canvasWidth);
  const height = useCanvasStore((s) => s.canvasHeight);
  const pixelSize = useCanvasStore((s) => s.pixelSize);
  const panX = useCanvasStore((s) => s.panX);
  const panY = useCanvasStore((s) => s.panY);

  const canvasRef = useCanvas({
    canvasWidth: width,
    canvasHeight: height,
  });

  useCanvasPan(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-1/2 left-1/2 z-0"
      style={{
        transform: `translate(${panX}px, ${panY}px) translate(-50%, -50%)`,
        transition: "transform 0s",
      }}
    >
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
    </div>
  );
}
