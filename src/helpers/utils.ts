import { tDefaultProps } from "../types";
import get from "lodash/get";
import orderBy from "lodash/orderBy";

export function objectToString(style?: { [key: string]: string }): string {
  if (!style) {
    return "";
  }
  const lines = Object.keys(style).map((property: string): string => {
    return `${property}: ${style[property]};`;
  });
  return lines.join("");
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

export const getMousePosition = (vertical: boolean, e: MouseEvent): number => {
  return vertical ? e.clientY || 0 : e.pageX || 0;
};

export const getPrecision = (step: number): number => {
  const stepString = step.toString();
  let precision = 0;
  if (stepString.indexOf(".") >= 0) {
    precision = stepString.length - stepString.indexOf(".") - 1;
  }
  return precision;
};

export const getClosestPoint = (
  val: number,
  { step, min, max }: { step: number | undefined; min: number; max: number },
  props: tDefaultProps
): number => {
  if (step) {
    let points: number[] = [];
    points = [...get(props, ["mark", "values"], [])];
    const baseNum = 10 ** getPrecision(step);
    const maxSteps = Math.floor(
      (max * baseNum - min * baseNum) / (step * baseNum)
    );
    const steps = Math.min((val - min) / step, maxSteps);
    const closestStep = Math.round(steps) * step + min;
    points.push(closestStep);
    const diffs = points.map((point) => Math.abs(val - point));
    return points[diffs.indexOf(Math.min(...diffs))];
  }
  return ensureValueInRange(val, { min, max });
};

export const ensureValuePrecision = (
  v: number,
  props: tDefaultProps | undefined
): number => {
  if (props) {
    const { step, min, max } = props;
    if (!step) {
      return v;
    }
    const closestPoint = isFinite(getClosestPoint(v, { step, min, max }, props))
      ? getClosestPoint(v, { step, min, max }, props)
      : 0;
    return parseFloat(closestPoint.toFixed(getPrecision(step)));
  }
  return 0;
};

export const prepareProps = (props: tDefaultProps): tDefaultProps => {
  let { values } = props;
  values = orderBy(values).map((v) => {
    return ensureValuePrecision(v, props);
  });
  return { ...props, values };
};
