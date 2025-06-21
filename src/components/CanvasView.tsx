import Canvas from "./Canvas";
import ZoomControls from "./ZoomControls";

export default function CanvasView() {
  return (
    <div className="flex flex-1 bg-gray-100 overflow-hidden relative">
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <Canvas />
      </div>
    </div>
  );
}
