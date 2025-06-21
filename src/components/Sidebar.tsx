import { useCanvasStore } from "@/lib/state";
import { swatches } from "@/lib/colors";

export default function Toolbar() {
  const color = useCanvasStore((s) => s.color);
  const setColor = useCanvasStore((s) => s.setColor);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const clear = useCanvasStore((s) => s.clearPixels);
  const save = useCanvasStore((s) => s.savePixels);
  const tool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);

  return (
    <div className="w-36 bg-slate-800 text-white p-3 flex flex-col gap-4">
      <h2 className="text-lg font-bold">Toolbar</h2>

      {/* Tool Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setTool("pencil")}
          className={`w-full px-2 py-1 border ${
            tool === "pencil" ? "bg-white text-black" : "bg-gray-100 text-black"
          }`}
        >
          ✏️
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`w-full px-2 py-1 border ${
            tool === "eraser" ? "bg-white text-black" : "bg-gray-100 text-black"
          }`}
        >
          🧽
        </button>
      </div>

      {/* Colors */}
      <div className="w-full bg-white/10 rounded-md p-2 flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Colors</h3>

        <div className="flex flex-wrap gap-1">
          {swatches.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 border border-white cursor-pointer ${
                c === color ? "ring-2 ring-white" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-8 border mt-2 cursor-pointer"
        />
      </div>

      {/* Actions */}
      <button
        onClick={undo}
        className="bg-white border px-4 py-1 w-full text-black"
      >
        Undo
      </button>
      <button
        onClick={redo}
        className="bg-white border px-4 py-1 w-full text-black"
      >
        Redo
      </button>
      <button
        onClick={clear}
        className="bg-white border px-4 py-1 w-full text-black"
      >
        Clear
      </button>
    </div>
  );
}
