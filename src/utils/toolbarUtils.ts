import type { ToolType } from "@/lib/toolbarButtons";

// Utility to check if a tool is a drawing tool
export function isDrawingTool(tool: ToolType | string): boolean {
  return tool === "pencil" || tool === "eraser" || tool === "fill";
}
