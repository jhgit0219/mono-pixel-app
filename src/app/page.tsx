"use client";
import Topbar from "@/components/Topbar";
import Toolbar from "@/components/Toolbar";
import Canvas from "@/components/Canvas";
import Navigator from "@/components/Navigator";
import ZoomControls from "@/components/ZoomControls";
import { useCanvasStore } from "@/lib/state";

export default function Home() {
  const canvasWidth = useCanvasStore((s) => s.canvasWidth);
  const canvasHeight = useCanvasStore((s) => s.canvasHeight);

  // Set max navigator size bounds (based on viewport, not zoom)
  const maxNavBoxWidth =
    typeof window !== "undefined" ? window.innerWidth / 2 : 300;
  const maxNavBoxHeight =
    typeof window !== "undefined" ? window.innerHeight / 2 : 300;

  const aspect = canvasWidth / canvasHeight;

  let navigatorWidth = maxNavBoxWidth;
  let navigatorHeight = navigatorWidth / aspect;

  if (navigatorHeight > maxNavBoxHeight) {
    navigatorHeight = maxNavBoxHeight;
    navigatorWidth = navigatorHeight * aspect;
  }

  return (
    <div className="h-screen w-screen flex flex-col relative">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <Canvas />
        </div>
      </div>

      <div
        className="absolute top-[64px] right-4 bg-white border rounded shadow overflow-hidden"
        style={{
          width: `${navigatorWidth}px`,
          height: `${navigatorHeight}px`,
        }}
      >
        <Navigator />
      </div>

      <ZoomControls />
    </div>
  );
}
