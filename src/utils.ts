export function objectToString(style: { [key: string]: string }): string {
  const lines = Object.keys(style).map((property: string): string => {
    return `${property}: ${style[property]};`;
  });
  return lines.join("\n");
}

export function calcOffset(
  value: number,
  min: number,
  max: number,
  precision?: 0
): number {
  const ratio = (value - min) / (max - min);
  return Number(Math.max(0, ratio * 100).toFixed(precision));
}

export function getHandleCenterPosition(
  vertical: boolean,
  handle: HTMLElement
): number {
  const coords = handle.getBoundingClientRect();
  return vertical
    ? coords.top + coords.height * 0.5
    : window.pageXOffset + coords.left + coords.width * 0.5;
}

export function ensureValueInRange(
  val: number,
  { max, min }: { max: number; min: number }
): number {
  if (val <= min) {
    return min;
  }
  if (val >= max) {
    return max;
  }
  return val;
}
