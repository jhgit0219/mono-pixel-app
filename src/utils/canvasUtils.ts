export function exportCanvasAsImage(canvas: HTMLCanvasElement) {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
}

export function getLinePixels(x0: number, y0: number, x1: number, y1: number) {
  const points: { x: number; y: number }[] = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return points;
}

// Utility to get cell from mouse event and canvas
export function getCellFromMouseEvent(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  pixelSize: number
) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pixelSize);
  const y = Math.floor((e.clientY - rect.top) / pixelSize);
  return { x, y };
}

// Utility to calculate optimal pixel size for viewport/canvas/layout
export function getOptimalPixelSize(
  canvasWidth: number,
  canvasHeight: number,
  layout: { TOOLBAR_WIDTH: number; TOPBAR_HEIGHT: number; MARGIN: number }
) {
  const availableWidth =
    window.innerWidth - layout.TOOLBAR_WIDTH - layout.MARGIN * 2;
  const availableHeight =
    window.innerHeight - layout.TOPBAR_HEIGHT - layout.MARGIN * 2;
  const maxPxByWidth = Math.floor(availableWidth / canvasWidth);
  const maxPxByHeight = Math.floor(availableHeight / canvasHeight);
  return Math.max(1, Math.min(maxPxByWidth, maxPxByHeight));
}

// Utility to perform flood fill algorithm on a pixel grid
export function floodFill(
  startX: number,
  startY: number,
  pixels: Record<string, string>,
  fillColor: string,
  canvasWidth: number,
  canvasHeight: number
): Record<string, string> {
  const key = (x: number, y: number) => `${x},${y}`;
  const targetColor = pixels[key(startX, startY)] ?? "";
  if (targetColor === fillColor) return {};

  const filled: Record<string, string> = {};
  const queue: Array<[number, number]> = [[startX, startY]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const k = key(x, y);
    if (visited.has(k)) continue;
    visited.add(k);

    // Stop at boundary (any filled cell that is not the target color)
    const currentColor = pixels[k] ?? "";
    if (currentColor !== targetColor) continue;

    filled[k] = fillColor;

    // Check neighbors (4-directional)
    if (x > 0) queue.push([x - 1, y]);
    if (x < canvasWidth - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < canvasHeight - 1) queue.push([x, y + 1]);
  }

  return filled;
}
