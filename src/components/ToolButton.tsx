import React from "react";
import { ToolType, ActionType } from "@/lib/toolbarButtons";
import { useCanvasStore } from "@/lib/state";
import type { IconType } from "react-icons";
import { theme } from "@/lib/theme"; // import theme

interface ToolButtonProps {
  id: ToolType | ActionType;
  label: string;
  icon: IconType;
  type: "tool" | "action";
}

export default function ToolButton({ id, label, icon, type }: ToolButtonProps) {
  const currentTool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);
  const store = useCanvasStore.getState();

  const isActive = type === "tool" && currentTool === id;

  const handleClick = () => {
    if (type === "tool") {
      setTool(id as ToolType);
    } else {
      const fn = store[id as ActionType];
      if (typeof fn === "function") fn();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 border rounded flex items-center justify-center ${
        isActive ? theme.toolActive : theme.toolInactive
      }`}
    >
      {React.createElement(icon, { className: "text-lg" })}
    </button>
  );
}
