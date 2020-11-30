export function calcOffset(
  value: number,
  min: number,
  max: number,
  precision: number = 0
): number {
  const ratio = (value - min) / (max - min);
  return Number(Math.max(0, ratio * 100).toFixed(precision));
}

export function objectToString(style: { [key: string]: string }): string {
  const lines = Object.keys(style).map((property: string): string => {
    return `${property}: ${style[property]};`;
  });
  return lines.join("\n");
}
