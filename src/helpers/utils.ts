import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import isUndefined from 'lodash/isUndefined';

import { DefaultProps, Props } from '../types';

const defaultProps: DefaultProps = {
  prefixCls: 'fsd-slider',
  values: [0],
  min: 0,
  max: 100,
  disabled: false,
  track: { on: true },
  rail: { on: true },
  vertical: false,
  reverse: false,
  precision: 0,
  mark: { values: [] },
};

function objectToString(style?: { [key: string]: string }): string {
  if (!style) {
    return '';
  }
  const lines = Object.keys(style).map(
    (property: string): string => `${property}: ${style[property]};`
  );
  return lines.join('');
}

function calcOffset(
  value: number,
  min: number,
  max: number,
  precision?: 0
): number {
  const ratio = (value - min) / (max - min);
  return Number(Math.max(0, ratio * 100).toFixed(precision));
}

function getHandleCenterPosition(
  vertical: boolean,
  handle: HTMLElement
): number {
  const coords = handle.getBoundingClientRect();
  return vertical
    ? coords.top + coords.height * 0.5
    : window.pageXOffset + coords.left + coords.width * 0.5;
}

function ensureValueInRange(
  value: number,
  { max, min }: { max: number; min: number }
): number {
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}

function getMousePosition(vertical: boolean, event: MouseEvent): number {
  const { clientY = 0, pageX = 0 } = event || {};
  return vertical ? clientY : pageX;
}

function getPrecision(step: number): number {
  const stepString = step.toString();
  let precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - 1 - stepString.indexOf('.');
  }
  return precision;
}

function getClosestPoint(
  value: number,
  { step, min, max }: { step: number | undefined; min: number; max: number },
  props: DefaultProps
): number {
  if (step) {
    let points: number[] = [...(props?.mark?.values || [])];
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
  }
  return value;
}

function ensureValuePrecision(value: number, props: DefaultProps): number {
  const { step, min, max } = props;
  const closestPoint = Number.isFinite(
    getClosestPoint(value, { step, min, max }, props)
  )
    ? getClosestPoint(value, { step, min, max }, props)
    : 0;
  return isUndefined(step)
    ? closestPoint
    : parseFloat(closestPoint.toFixed(getPrecision(step)));
}

function checkNeighbors(value: number[]): boolean {
  return value.length > 1;
}

function ensureValueCorrectNeighbors(options: {
  value: number;
  props: DefaultProps;
  index: number;
}): number {
  const { props, index } = options;
  const { indent, values } = props;
  let { min, max } = props;
  const { value } = options;
  if (checkNeighbors(values)) {
    const prevValue = get(values, [index - 1]);
    const nextValue = get(values, [index + 1]);
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

function calcValueWithEnsure(options: {
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

function prepareValues(props: DefaultProps): DefaultProps {
  let { values } = props;
  const { mark } = props;
  values = orderBy(values).map((value, index) =>
    calcValueWithEnsure({ value, props, index })
  );
  let markValues: number[] = (mark?.values || []).map((value) =>
    ensureValueInRange(value, { min: props.min, max: props.max })
  );
  markValues = orderBy(uniq(markValues), [], ['asc']);
  return { ...props, values, mark: { ...mark, values: markValues } };
}

function getCount(props?: DefaultProps): number {
  return get(props, ['values'], []).length;
}

function getSliderStart(options: {
  props?: DefaultProps;
  view?: JQuery<HTMLElement>;
}): number {
  const { props, view } = options;
  if (props && view) {
    const { vertical, reverse } = props;
    const rect = view.get(0).getBoundingClientRect();
    if (vertical) {
      return reverse ? rect.bottom : rect.top;
    }
    return window.pageXOffset + (reverse ? rect.right : rect.left);
  }
  return 0;
}

function getSliderLength(options: {
  view?: JQuery<HTMLElement>;
  props?: DefaultProps;
}): number {
  const { props, view } = options;
  if (props && view) {
    const { vertical } = props;
    const coords = view.get(0).getBoundingClientRect();
    return vertical ? coords.height : coords.width;
  }
  return 0;
}

function calcValue(options: {
  offset: number;
  length: number;
  props: DefaultProps;
}): number {
  const { offset, length, props } = options;
  const { vertical, min, max, precision } = props;
  const ratio = Math.abs(Math.max(offset, 0) / length);
  const value = vertical
    ? (1 - ratio) * (max - min) + min
    : ratio * (max - min) + min;
  return Number(value.toFixed(precision));
}

function calcValueByPos(options: {
  position: number;
  start: number;
  props: DefaultProps;
  index: number;
  length: number;
}): number {
  const { position, props, start } = options;
  const { reverse, min, max } = props;
  const sign = reverse ? -1 : +1;
  const offset = sign * (position - start);
  let value = ensureValueInRange(calcValue({ ...options, offset }), {
    min,
    max,
  });
  value = calcValueWithEnsure({ ...options, value });
  return value;
}

function setFunctionGetBoundingClientRectHTMLElement(
  style?: Partial<{
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
  }>
): void {
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

  window.HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
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

function prepareData(props?: Props, prevProps?: DefaultProps): DefaultProps {
  const values: number[] =
    props?.values || prevProps?.values || defaultProps.values;
  const markValues: number[] | undefined =
    props?.mark?.values ||
    prevProps?.mark?.values ||
    defaultProps?.mark?.values;
  const mergeProps: DefaultProps = merge({}, defaultProps, prevProps, props);
  return prepareValues({
    ...mergeProps,
    values,
    mark: { ...mergeProps?.mark, values: markValues },
  });
}

function uniqId(): string {
  return Math.random().toString(16).substr(2);
}

function getPosition({
  vertical = false,
  coordinateX = 0,
  coordinateY = 0,
}: {
  vertical: boolean;
  coordinateX: number;
  coordinateY: number;
}): number {
  return vertical ? coordinateY : coordinateX;
}

function getNearest({
  value,
  values,
}: {
  value: number;
  values: number[];
}): {
  index: number;
  value: number;
} {
  let readyIndex = 0;
  let readyValue = values[0];
  let readyDifferent = Number.MAX_SAFE_INTEGER;
  values.forEach((item, index) => {
    const different = Math.abs(value - item);
    if (readyDifferent > different) {
      readyDifferent = different;
      readyIndex = index;
      readyValue = item;
    }
  });
  return { index: readyIndex, value: readyValue };
}

function getNearestIndex(options: {
  coordinateX: number;
  coordinateY: number;
  start: number;
  props: DefaultProps;
  length: number;
}): number {
  const { coordinateX, coordinateY, props, start } = options;
  const { reverse, min, max, values, vertical } = props;
  const position = getPosition({ vertical, coordinateX, coordinateY });
  const sign = reverse ? -1 : +1;
  const offset = sign * (position - start);
  const value = ensureValueInRange(calcValue({ ...options, offset }), {
    min,
    max,
  });
  const { index } = getNearest({ value, values });
  return index;
}

export {
  objectToString,
  uniqId,
  prepareData,
  setFunctionGetBoundingClientRectHTMLElement,
  calcValueWithEnsure,
  ensureValueCorrectNeighbors,
  checkNeighbors,
  calcValueByPos,
  calcValue,
  getSliderLength,
  getSliderStart,
  getCount,
  prepareValues,
  ensureValuePrecision,
  getClosestPoint,
  getPrecision,
  getMousePosition,
  ensureValueInRange,
  calcOffset,
  getHandleCenterPosition,
  getPosition,
  getNearestIndex,
  getNearest,
  defaultProps,
};
