import get from "lodash/get";
import orderBy from "lodash/orderBy";
import merge from "lodash/merge";
import uniq from "lodash/uniq";
import isUndefined from "lodash/isUndefined";

import { IView } from "../slider/interface";

import { defaultProps } from "../slider/index";
import { DefaultProps, Props } from "../types";

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
    precision = stepString.length - 1 - stepString.indexOf(".");
  }
  return precision;
};

export const getClosestPoint = (
  value: number,
  { step, min, max }: { step: number | undefined; min: number; max: number },
  props: DefaultProps
): number => {
  if (step) {
    let points: number[] = [...get(props, ["mark", "values"], [])];
    const baseNum = 10 ** getPrecision(step);
    const maxSteps = Math.floor(
      (max * baseNum - min * baseNum) / (step * baseNum)
    );
    const steps = Math.min((value - min) / step, maxSteps);
    const closestStep = Math.round(steps) * step + min;
    points.push(closestStep);
    points = uniq(points);
    const diffs = points.map((point) => Math.abs(value - point));
    return points[diffs.indexOf(Math.min(...diffs))];
  } else {
    return value;
  }
};

export const ensureValuePrecision = (
  v: number,
  props: DefaultProps,
  index: number
): number => {
  const { step, min, max } = props;
  const closestPoint = isFinite(getClosestPoint(v, { step, min, max }, props))
    ? getClosestPoint(v, { step, min, max }, props)
    : 0;
  return isUndefined(step)
    ? closestPoint
    : parseFloat(closestPoint.toFixed(getPrecision(step)));
};

export const prepareValues = (props: DefaultProps): DefaultProps => {
  let { values, mark } = props;
  values = orderBy(values).map((v, index) => {
    return calcValueWithEnsure({ value: v, props, index });
  });
  let markValues: number[] = (mark?.values || []).map((v) => {
    return ensureValueInRange(v, { min: props.min, max: props.max });
  });
  markValues = orderBy(uniq(markValues), [], ["asc"]);
  return { ...props, values, mark: { ...mark, values: markValues } };
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

export function checkNeighbors(value: number[]) {
  return value.length > 1;
}

export function ensureValueCorrectNeighbors(options: {
  value: number;
  props: DefaultProps;
  index: number;
}): number {
  const { props, index } = options;
  const { indent, values } = props;
  let { min, max } = props;
  let { value } = options;
  if (checkNeighbors(values)) {
    let prevValue = get(values, [index - 1], min);
    let nextValue = get(values, [index + 1], max);
    if (!isUndefined(prevValue)) {
      min = indent ? prevValue + indent : prevValue;
    }
    if (!isUndefined(nextValue)) {
      max = indent ? nextValue - indent : nextValue;
    }
  }
  return ensureValueInRange(value, {
    min,
    max,
  });
}

export function calcValueWithEnsure(options: {
  value: number;
  props: DefaultProps;
  index: number;
}): number {
  const { props, index } = options;
  let { value } = options;
  value = ensureValuePrecision(value, props, index);
  value = ensureValueCorrectNeighbors({ ...options, value });
  return value;
}

export function setFunctionGetBoundingClientRectHTMLElement(
  style?: Partial<{
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
  }>
) {
  const defaultStyle = {
    width: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  };
  const { width, height, marginTop, marginLeft, marginBottom, marginRight } = {
    ...defaultStyle,
    ...style,
  };

  window.HTMLElement.prototype.getBoundingClientRect = function () {
    const domRect: DOMRect = {
      width: parseFloat(this.style.width) || width || 0,
      height: parseFloat(this.style.height) || height || 0,
      top: parseFloat(this.style.marginTop) || marginTop || 0,
      left: parseFloat(this.style.marginLeft) || marginLeft || 0,
      x: 0,
      y: 0,
      toJSON: () => {},
      bottom: parseFloat(this.style.marginBottom) || marginBottom || 0,
      right: parseFloat(this.style.marginRight) || marginRight || 0,
    };
    return domRect;
  };
}

export function prepareData(
  props?: Props,
  prevProps?: DefaultProps
): DefaultProps {
  const values: number[] =
    props?.values || prevProps?.values || defaultProps.values;
  const markValues: number[] | undefined =
    props?.mark?.values ||
    prevProps?.mark?.values ||
    defaultProps?.mark?.values;
  let mergeProps: DefaultProps = merge({}, defaultProps, prevProps, props);
  return prepareValues({
    ...mergeProps,
    values,
    mark: { ...mergeProps?.mark, values: markValues },
  });
}

export function uniqId() {
  return Math.random().toString(16).substr(2);
}
