import { useEffect, useRef } from "react";
import { useCanvasEvents } from "./useCanvasEvents";
import { useCanvasDraw } from "./useCanvasDraw";
import { useCanvasStore } from "@/lib/state";
import { CANVAS, LAYOUT } from "@/types";
import { getOptimalPixelSize } from "@/utils/canvasUtils";

interface UseCanvasOptions {
  pixelSize?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export function useCanvas({
  pixelSize,
  canvasWidth = CANVAS.DEFAULT_WIDTH,
  canvasHeight = CANVAS.DEFAULT_HEIGHT,
}: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixels = useCanvasStore((s) => s.pixels);
  const setPixelSize = useCanvasStore((s) => s.setPixelSize);
  const setInitialPixelSize = useCanvasStore((s) => s.setInitialPixelSize);

  useEffect(() => {
    // Use utility for optimal pixel size calculation
    const optimalPixelSize = getOptimalPixelSize(canvasWidth, canvasHeight, LAYOUT);
    const finalPixelSize = pixelSize ?? optimalPixelSize;

    setInitialPixelSize(optimalPixelSize);
    setPixelSize(finalPixelSize);
  }, [canvasWidth, canvasHeight, pixelSize]);

  const globalPixelSize = useCanvasStore((s) => s.pixelSize);

  useCanvasDraw(canvasRef, pixels, globalPixelSize, canvasWidth, canvasHeight);
  useCanvasEvents(canvasRef, globalPixelSize);

  return canvasRef;
}
