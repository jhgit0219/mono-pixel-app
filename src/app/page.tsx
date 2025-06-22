"use client";
import Topbar from "@/components/Topbar";
import Toolbar from "@/components/Toolbar";
import CanvasView from "@/components/CanvasView";
import Navigator from "@/components/Navigator";
import ZoomControls from "@/components/ZoomControls";
import { useCanvasStore } from "@/lib/state";
import { LAYOUT } from "@/types";
import { useNavigatorBoxSize } from "@/hooks/useNavigatorBoxSize";

export default function Home() {
  const canvasWidth = useCanvasStore((s) => s.canvasWidth);
  const canvasHeight = useCanvasStore((s) => s.canvasHeight);

  const navBoxSize = useNavigatorBoxSize(canvasWidth, canvasHeight);

  return (
    <div className="h-screen w-screen flex flex-col relative ">
      <div className="z-20">
        <Topbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className="w-[144px] z-10 relative"
          style={{ height: `calc(100vh - ${LAYOUT.TOPBAR_HEIGHT}px)` }}
        >
          <Toolbar />
        </div>
        <div className="flex-1 bg-gray-500 z-0 relative h-full">
          <CanvasView />
        </div>
      </div>

      <div
        className="absolute top-[64px] right-4 bg-white border rounded shadow overflow-hidden"
        style={{
          width: `${navBoxSize.width}px`,
          height: `${navBoxSize.height}px`,
        }}
      >
        <Navigator />
      </div>

      <ZoomControls />
    </div>
  );
}
