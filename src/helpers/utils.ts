import get from "lodash/get";
import orderBy from "lodash/orderBy";
import isUndefined from "lodash/isUndefined";

import { IView } from "../slider/interface";

import { DefaultProps } from "../types";

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
  props: DefaultProps
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
  props: DefaultProps
): number => {
  const { step, min, max } = props;
  if (!step) {
    return v;
  }
  const closestPoint = isFinite(getClosestPoint(v, { step, min, max }, props))
    ? getClosestPoint(v, { step, min, max }, props)
    : 0;
  return parseFloat(closestPoint.toFixed(getPrecision(step)));
};

export const prepareProps = (props: DefaultProps): DefaultProps => {
  let { values } = props;
  values = orderBy(values).map((v) => {
    return ensureValuePrecision(v, props);
  });
  return { ...props, values };
};

export const getCount = (props?: DefaultProps): number => {
  return get(props, ["values"], []).length;
};

export const getSliderStart = (
  props?: DefaultProps,
  view?: JQuery<HTMLElement>
): number => {
  if (props && view) {
    const { vertical, reverse } = props;
    const rect = view.get(0).getBoundingClientRect();
    if (vertical) {
      return reverse ? rect.bottom : rect.top;
    }
    return window.pageXOffset + (reverse ? rect.right : rect.left);
  }
  return 0;
};

export function getSliderLength(options: {
  view: JQuery<HTMLElement>;
  props: DefaultProps;
}): number {
  const { props, view } = options;
  const { vertical } = props;
  const coords = view.get(0).getBoundingClientRect();
  return vertical ? coords.height : coords.width;
}

export function calcValue(options: {
  offset: number;
  view: JQuery<HTMLElement>;
  props: DefaultProps;
  index: number;
}): number {
  const { offset, view, props } = options;
  const { vertical, min, max, precision } = props;
  const ratio = Math.abs(
    Math.max(offset, 0) / getSliderLength({ view, props })
  );
  const value = vertical
    ? (1 - ratio) * (max - min) + min
    : ratio * (max - min) + min;
  return Number(value.toFixed(precision));
}

export function calcValueByPos(options: {
  position: number;
  view: JQuery<HTMLElement>;
  props: DefaultProps;
  index: number;
}): number {
  const { position, view, props } = options;
  const { reverse, min, max } = props;
  const sign = reverse ? -1 : +1;
  const offset = sign * (position - getSliderStart(props, view));
  let value = ensureValueInRange(calcValue({ ...options, offset }), {
    min,
    max,
  });
  value = calcValueWithEnsure({ ...options, value });
  return value;
}

export function checkNeighbors(
  allowCross: boolean | undefined,
  value: number[]
) {
  return !allowCross && value.length > 1;
}

export function ensureValueCorrectNeighbors(options: {
  value: number;
  props: DefaultProps;
  index: number;
}): number {
  const { props, index } = options;
  const { allowCross, values, push } = props;
  let { min, max } = props;
  let { value } = options;
  if (checkNeighbors(allowCross, values)) {
    let prevValue = get(values, [index - 1]);
    let nextValue = get(values, [index + 1]);
    if (!isUndefined(prevValue)) {
      min = push ? prevValue + push : prevValue;
    }
    if (!isUndefined(nextValue)) {
      max = push ? nextValue - push : nextValue;
    }
    value = ensureValueInRange(value, {
      min,
      max,
    });
  }
  return value;
}

export function calcValueWithEnsure(options: {
  value: number;
  props: DefaultProps;
  index: number;
}): number {
  const { props } = options;
  let { value } = options;
  value = ensureValuePrecision(value, props);
  value = ensureValueCorrectNeighbors({ ...options, value });
  return value;
}
