import {
  FaPencilAlt,
  FaEraser,
  FaFillDrip,
  FaUndo,
  FaRedo,
  FaHandPaper,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export type ToolType = "pencil" | "eraser" | "fill" | "pan";
export type ActionType = "undo" | "redo";

export type ToolbarItem = {
  id: ToolType | ActionType;
  label: string;
  icon: IconType;
  type: "tool" | "action";
};

export const toolbarButtons: ToolbarItem[] = [
  { id: "pencil", label: "Pencil", icon: FaPencilAlt, type: "tool" },
  { id: "eraser", label: "Eraser", icon: FaEraser, type: "tool" },
  { id: "fill", label: "Fill", icon: FaFillDrip, type: "tool" },
  { id: "pan", label: "Pan", icon: FaHandPaper, type: "tool" },
  { id: "undo", label: "Undo", icon: FaUndo, type: "action" },
  { id: "redo", label: "Redo", icon: FaRedo, type: "action" },
];
