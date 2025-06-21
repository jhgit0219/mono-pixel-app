import { RefObject, useEffect, useRef } from "react";
import { getLinePixels } from "@/utils/canvasUtils";
import { useCanvasStore } from "@/lib/state";

export function useCanvasEvents(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pixelSize: number
) {
  const setPixelsExternal = useCanvasStore((s) => s.setPixelsExternal);
  const commitHistory = useCanvasStore((s) => s.commitHistory);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);
  const didCommitRef = useRef(false);
  const preStrokeSnapshotRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDrawing = false;
    let strokePixels: Record<string, string> = {};

    const getCell = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / pixelSize);
      const y = Math.floor((e.clientY - rect.top) / pixelSize);
      return { x, y };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const store = useCanvasStore.getState();
      const pixels = store.pixels;

      isDrawing = true;
      didCommitRef.current = false;
      strokePixels = {};
      preStrokeSnapshotRef.current = structuredClone(pixels);

      const cell = getCell(e);
      lastCellRef.current = cell;

      // Apply the initial stroke
      const tool = store.tool;
      const key = `${cell.x},${cell.y}`;
      const current = pixels[key];

      const newPixels: Record<string, string> = {};
      if (tool === "eraser") {
        if (current !== undefined) {
          newPixels[key] = "";
        }
      } else {
        if (current !== "#000") {
          newPixels[key] = "#000";
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
          if (current !== "#000") {
            newPixels[key] = "#000";
            strokePixels[key] = "#000";
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
    };
  }, [canvasRef, pixelSize, setPixelsExternal, commitHistory]);
}
