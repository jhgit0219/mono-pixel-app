import { RefObject, useEffect, useRef } from "react";
import { getLinePixels, getCellFromMouseEvent } from "@/utils/canvasUtils";
import { useCanvasStore } from "@/lib/state";
import { isDrawingTool } from "@/utils/toolbarUtils";
import { floodFill } from "@/utils/canvasUtils";

export function useCanvasEvents(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pixelSize: number
) {
  const setPixelsExternal = useCanvasStore((s) => s.setPixelsExternal);
  const commitHistory = useCanvasStore((s) => s.commitHistory);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const didCommitRef = useRef(false);
  const preStrokeSnapshotRef = useRef<Record<string, string>>({});
  const isSpaceHeld = useRef(false);

  const canvasWidth = useCanvasStore((s) => s.canvasWidth);
  const canvasHeight = useCanvasStore((s) => s.canvasHeight);
  const color = useCanvasStore((s) => s.color);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDrawing = false;
    let strokePixels: Record<string, string> = {};

    // Listen for spacebar key events to track panning mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") isSpaceHeld.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") isSpaceHeld.current = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Use utility for cell calculation
    const getCell = (e: MouseEvent) =>
      getCellFromMouseEvent(e, canvas, pixelSize);

    const handleMouseDown = (e: MouseEvent) => {
      const store = useCanvasStore.getState();
      const pixels = store.pixels;
      const tool = store.tool;

      // Disable drawing if panning (space held) or not a drawing tool
      if (isSpaceHeld.current || !isDrawingTool(tool) || e.button !== 0) return;

      isDrawing = true;
      didCommitRef.current = false;
      strokePixels = {};
      preStrokeSnapshotRef.current = structuredClone(pixels);

      const cell = getCell(e);

      if (tool === "fill") {
        // Use flood fill
        const filled = floodFill(
          cell.x,
          cell.y,
          pixels,
          color,
          canvasWidth,
          canvasHeight
        );
        if (Object.keys(filled).length > 0) {
          commitHistory(structuredClone(pixels));
          setPixelsExternal((prev) => ({ ...prev, ...filled }));
        }
        return;
      }

      lastCellRef.current = cell;

      // Apply the initial stroke
      const key = `${cell.x},${cell.y}`;
      const current = pixels[key];

      const newPixels: Record<string, string> = {};
      if (tool === "eraser") {
        if (current !== undefined) {
          newPixels[key] = "";
        }
      } else {
        if (current !== color) {
          newPixels[key] = color;
        }
      }

      if (Object.keys(newPixels).length > 0) {
        commitHistory(structuredClone(preStrokeSnapshotRef.current));
        didCommitRef.current = true;

        setPixelsExternal((prev) => {
          const updated = { ...prev };
          for (const key in newPixels) {
            if (newPixels[key]) {
              updated[key] = newPixels[key];
            } else {
              delete updated[key];
            }
          }
          return updated;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const cell = getCell(e);
      if (
        !lastCellRef.current ||
        (cell.x === lastCellRef.current.x && cell.y === lastCellRef.current.y)
      )
        return;

      const tool = useCanvasStore.getState().tool;
      const pixels = useCanvasStore.getState().pixels;
      const linePixels = getLinePixels(
        lastCellRef.current.x,
        lastCellRef.current.y,
        cell.x,
        cell.y
      );

      const newPixels: Record<string, string> = {};
      for (const { x, y } of linePixels) {
        const key = `${x},${y}`;
        const current = pixels[key];

        if (tool === "eraser") {
          if (current !== undefined) {
            newPixels[key] = "";
            strokePixels[key] = "";
          }
        } else {
          if (current !== color) {
            newPixels[key] = color;
            strokePixels[key] = color;
          }
        }
      }

      if (Object.keys(newPixels).length > 0) {
        if (!didCommitRef.current) {
          commitHistory(structuredClone(preStrokeSnapshotRef.current));
          didCommitRef.current = true;
        }

        setPixelsExternal((prev) => {
          const updated = { ...prev };
          for (const key in newPixels) {
            if (newPixels[key]) {
              updated[key] = newPixels[key];
            } else {
              delete updated[key];
            }
          }
          return updated;
        });
      }

      lastCellRef.current = cell;
    };

    const handleMouseUp = () => {
      isDrawing = false;
      lastCellRef.current = null;
      strokePixels = {};
      didCommitRef.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    canvasRef,
    pixelSize,
    setPixelsExternal,
    commitHistory,
    color,
    canvasWidth,
    canvasHeight,
  ]);
}
