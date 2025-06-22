"use client";
import { useState } from "react";
import { useCanvasStore } from "@/lib/state";
import { theme } from "@/lib/theme";

export default function CanvasSizeDialog({ onClose }: { onClose: () => void }) {
  const setCanvasSize = useCanvasStore((s) => s.setCanvasSize);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);

  const handleApply = () => {
    const w = Math.min(1024, Math.max(8, width));
    const h = Math.min(1024, Math.max(8, height));
    setCanvasSize(w, h);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`p-4 rounded shadow w-80 space-y-4 ${theme.dialogBg}`}>
        <h2 className={`text-lg font-bold ${theme.dialogHeading}`}>
          New Canvas
        </h2>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className={`text-sm font-medium block ${theme.labelText}`}>
              Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={8}
              max={1024}
              className={`w-full px-2 py-1 rounded border ${theme.inputBorder} ${theme.inputText}`}
            />
          </div>
          <div className="flex-1">
            <label className={`text-sm font-medium block ${theme.labelText}`}>
              Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={8}
              max={1024}
              className={`w-full px-2 py-1 rounded border ${theme.inputBorder} ${theme.inputText}`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-3 py-1 text-sm rounded border ${theme.buttonAlt}`}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className={`px-3 py-1 text-sm rounded ${theme.button}`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
