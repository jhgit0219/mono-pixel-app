"use client";
import { useState, useRef } from "react";
import CanvasSizeDialog from "./CanvasSizeDialog";
import { useCanvasStore } from "@/lib/state";
import { theme } from "@/lib/theme";
import { useOutsideClick } from "@/hooks/useDOMHelpers";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const savePixels = useCanvasStore((s) => s.savePixels);

  const fileMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(fileMenuRef, () => setMenuOpen(false));

  return (
    <>
      <div
        className={`flex items-center p-2 text-sm relative ${theme.sidebarBg} ${theme.sidebarText}`}
      >
        {/* Logo / App Name */}
        <span className={`font-bold text-4xl ${theme.heading}`}>MONOPIXEL</span>

        {/* File menu */}
        <div ref={fileMenuRef} className="relative ml-10">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`px-2 py-1 rounded ${theme.buttonAlt}`}
          >
            File ▾
          </button>

          {menuOpen && (
            <div
              className={`absolute mt-1 w-28 rounded shadow ${theme.panelBg}`}
            >
              <button
                onClick={() => {
                  setDialogOpen(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-1 hover:opacity-80"
              >
                New
              </button>
              <button
                onClick={() => {
                  savePixels();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-1 hover:opacity-80"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {dialogOpen && (
        <div className="z-50">
          <CanvasSizeDialog onClose={() => setDialogOpen(false)} />
        </div>
      )}
    </>
  );
}
