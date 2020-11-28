export function calcOffset(value: number, min: number, max: number): number {
  const ratio = (value - min) / (max - min);
  return Math.max(0, ratio * 100);
}

export function objectToString(style: { [key: string]: string }): string {
  const lines = Object.keys(style).map((property: string): string => {
    return `${property}: ${style[property]};`;
  });
  return lines.join("\n");
}
