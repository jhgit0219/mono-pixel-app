import { useCanvasStore } from "@/lib/state";

const PIXEL_SIZE_MAX = 60;
const ZOOM_STEP = 5;

export default function ZoomControls() {
  const pixelSize = useCanvasStore((s) => s.pixelSize);
  const initialPixelSize = useCanvasStore((s) => s.initialPixelSize);
  const setPixelSize = useCanvasStore((s) => s.setPixelSize);

  const panX = useCanvasStore((s) => s.panX);
  const panY = useCanvasStore((s) => s.panY);
  const setPan = useCanvasStore((s) => s.setPan);

  const maxOffset =
    Math.floor((PIXEL_SIZE_MAX - initialPixelSize) / ZOOM_STEP) * ZOOM_STEP;

  const sliderValue = Math.min(pixelSize - initialPixelSize, maxOffset);

  const zoomIn = () => {
    const next = Math.min(pixelSize + ZOOM_STEP, initialPixelSize + maxOffset);
    setPixelSize(next);
  };

  const zoomOut = () => {
    const next = Math.max(pixelSize - ZOOM_STEP, initialPixelSize);
    setPixelSize(next);
  };

  const resetZoomAndPan = () => {
    setPixelSize(initialPixelSize);
    setPan(0, 0);
  };

  const atMaxZoom = pixelSize >= initialPixelSize + maxOffset;
  const atMinZoom = pixelSize <= initialPixelSize;
  const isPanned = panX !== 0 || panY !== 0;
  const canReset = !atMinZoom || isPanned;

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const offset = Number(e.target.value);
    const nextPixelSize = Math.min(
      initialPixelSize + offset,
      initialPixelSize + maxOffset
    );
    setPixelSize(nextPixelSize);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border rounded shadow p-3 flex flex-col items-center gap-2 w-16">
      <button
        onClick={zoomIn}
        disabled={atMaxZoom}
        className="text-xl font-bold w-full border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>

      <div className="h-32 flex items-center justify-center">
        <input
          type="range"
          min={0}
          max={maxOffset}
          step={ZOOM_STEP}
          value={sliderValue}
          onChange={handleSlider}
          className="w-32 h-4 rotate-[-90deg] origin-center cursor-pointer"
        />
      </div>

      <button
        onClick={zoomOut}
        disabled={atMinZoom}
        className="text-xl font-bold w-full border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        −
      </button>

      <button
        onClick={resetZoomAndPan}
        disabled={!canReset}
        className="text-xs mt-1 px-2 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset
      </button>

      <span className="text-xs text-gray-500">{pixelSize}px</span>
    </div>
  );
}
