import { useEffect, useRef } from "react";
import { useCanvasStore } from "@/lib/state";

export function useCanvasPan(
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>
) {
  const panX = useCanvasStore((s) => s.panX);
  const panY = useCanvasStore((s) => s.panY);
  const setPan = useCanvasStore((s) => s.setPan);
  const currentTool = useCanvasStore((s) => s.tool);

  const isPanning = useRef(false);
  const isSpaceHeld = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = canvasWrapperRef.current;
    if (!el) return;

    const shouldPan = () => currentTool === "pan" || isSpaceHeld.current;

    const handleMouseDown = (e: MouseEvent) => {
      if (!shouldPan()) return;
      // If the left mouse button is not pressed, ignore the event
      if (e.button !== 0) return;
      // Look for a parent element with the canvas view marker
      const isInsideCanvasView = (e.target as HTMLElement)?.closest(
        "[data-canvasview]"
      );

      if (!isInsideCanvasView) return;

      isPanning.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      setPan(panX + dx, panY + dy);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceHeld.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceHeld.current = false;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [canvasWrapperRef, panX, panY, setPan, currentTool]);
}
