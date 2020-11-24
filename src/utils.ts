export function objectToString(style: { [key: string]: string }): string {
  const lines = Object.keys(style).map((property: string): string => {
    return `${property}: ${style[property]};`;
  });
  return lines.join("\n");
}
