import { useRef } from "react";
import Canvas from "./Canvas";
import ZoomControls from "./ZoomControls";
import { usePreventSpacebarButtonPress } from "@/hooks/useDOMHelpers";

export default function CanvasView() {
  const viewRef = useRef<HTMLDivElement>(null);

  usePreventSpacebarButtonPress();

  return (
    <div
      ref={viewRef}
      data-canvasview
      className="flex flex-1 bg-gray-100 overflow-visible relative z-10 w-full h-full"
    >
      <div className="flex-1 flex items-center justify-center overflow-visible relative">
        <Canvas />
      </div>
      <ZoomControls />
    </div>
  );
}
