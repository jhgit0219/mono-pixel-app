export const CANVAS = {
  MIN_SIZE: 8,
  MAX_SIZE: 128,
  DEFAULT_WIDTH: 128,
  DEFAULT_HEIGHT: 128,
  DEFAULT_PIXEL_SIZE: 20,
};

export const LAYOUT = {
  TOOLBAR_WIDTH: 144,
  TOPBAR_HEIGHT: 48,
  MARGIN: 20,
};

export interface Pixel {
  x: number;
  y: number;
  color: string;
}
