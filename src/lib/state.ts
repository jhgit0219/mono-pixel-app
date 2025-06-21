import { create } from "zustand";
import type { ToolType } from "@/lib/toolbarButtons";
import { CANVAS } from "@/types";

type Tool = ToolType;

interface CanvasState {
  pixels: Record<string, string>;
  history: Record<string, string>[];
  future: Record<string, string>[];
  tool: Tool;
  color: string;
  canvasWidth: number;
  canvasHeight: number;
  pixelSize: number;
  initialPixelSize: number;

  setPixelSize: (size: number) => void;
  setInitialPixelSize: (size: number) => void;

  setCanvasSize: (width: number, height: number) => void;

  clearPixels: () => void;
  savePixels: () => void;

  commitHistory: (snapshot: Record<string, string>) => void;
  undo: () => void;
  redo: () => void;

  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setPixelsExternal: (
    updateFn: (prev: Record<string, string>) => Record<string, string>
  ) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  pixels: {},
  history: [],
  future: [],
  tool: "pencil",
  color: "#000000",
  canvasWidth: CANVAS.DEFAULT_WIDTH,
  canvasHeight: CANVAS.DEFAULT_HEIGHT,
  pixelSize: CANVAS.DEFAULT_PIXEL_SIZE,
  initialPixelSize: CANVAS.DEFAULT_PIXEL_SIZE,

  setInitialPixelSize: (size) => set({ initialPixelSize: size }),
  setPixelSize: (size) => set({ pixelSize: size }),

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),

  setPixelsExternal: (updateFn) =>
    set((state) => ({ pixels: updateFn(state.pixels) })),

  commitHistory: (snapshot) => {
    const { history } = get();
    set({
      history: [...history, structuredClone(snapshot)],
      future: [],
    });
  },

  undo: () => {
    const { history, pixels, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      pixels: previous,
      history: history.slice(0, -1),
      future: [pixels, ...future],
    });
  },

  redo: () => {
    const { history, pixels, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      pixels: next,
      history: [...history, pixels],
      future: future.slice(1),
    });
  },

  clearPixels: () => {
    const { pixels, history } = get();
    if (Object.keys(pixels).length === 0) return;
    set({
      pixels: {},
      history: [...history, structuredClone(pixels)],
      future: [],
    });
  },

  savePixels: () => {
    const { pixels } = get();
    const json = JSON.stringify(pixels, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas-pixels.json";
    a.click();

    URL.revokeObjectURL(url);
  },

  setCanvasSize: (width, height) => {
    const w = Math.min(1024, Math.max(8, width));
    const h = Math.min(1024, Math.max(8, height));

    set(() => ({
      canvasWidth: w,
      canvasHeight: h,
      pixels: {},
      history: [],
      future: [],
    }));
  },
}));
