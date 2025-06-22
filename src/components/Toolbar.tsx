import { useCanvasStore } from "@/lib/state";
import { swatches } from "@/lib/colors";
import { toolbarButtons } from "@/lib/toolbarButtons";
import ToolButton from "./ToolButton";
import { theme } from "@/lib/theme";

export default function Toolbar() {
  const color = useCanvasStore((s) => s.color);
  const setColor = useCanvasStore((s) => s.setColor);
  const clear = useCanvasStore((s) => s.clearPixels);
  const save = useCanvasStore((s) => s.savePixels);

  return (
    <div
      className={`w-36 h-full p-3 flex flex-col gap-4 ${theme.sidebarBg} ${theme.sidebarText}`}
    >
      <h2 className={`text-lg font-bold ${theme.heading}`}>Toolbar</h2>

      <div className="flex flex-col gap-2">
        {toolbarButtons.map((btn) => (
          <ToolButton
            key={btn.id}
            id={btn.id}
            label={btn.label}
            icon={btn.icon}
            type={btn.type}
          />
        ))}
      </div>

      <div
        className={`w-full rounded-md p-2 flex flex-col gap-2 ${theme.panelBg}`}
      >
        <h3 className="text-sm font-semibold">Colors</h3>
        <div className="flex flex-wrap gap-1">
          {swatches.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 cursor-pointer border ${theme.swatchBorder} ${
                c === color ? `${theme.ring} ring-2` : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className={`w-full h-8 mt-2 cursor-pointer ${theme.inputBorder} border`}
        />
      </div>

      {/* Dedicated Action Buttons */}
      <button
        onClick={clear}
        className={`px-4 py-1 w-full border ${theme.button}`}
      >
        Clear
      </button>
    </div>
  );
}
