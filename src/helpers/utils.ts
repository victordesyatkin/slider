import orderBy from 'lodash.orderby';
import merge from 'lodash.merge';
import uniq from 'lodash.uniq';
import isUndefined from 'lodash.isundefined';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import trim from 'lodash.trim';

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
  isFocused: false,
  step: 0,
  indent: 0,
};

function isReallyObject(value: unknown): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

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
  precision = 0
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
    // console.log('value : ', value);
    const steps = Math.min((value - min) / step, maxSteps);
    const closestStep = Math.round(steps) * step + min;
    // console.log('baseNum : ', baseNum);
    // console.log('maxSteps : ', maxSteps);
    // console.log('step : ', step);
    // console.log('steps : ', steps);
    // console.log('closestStep : ', closestStep);
    points.push(closestStep);
    points = uniq(points);
    const diffs = points.map((point) => Math.abs(value - point));
    return points[diffs.indexOf(Math.min(...diffs))];
  }
  return value;
}

function ensureValuePrecision(value: number, props: DefaultProps): number {
  const { step = 0, min, max } = props;
  const closestPoint = Number.isFinite(
    getClosestPoint(value, { step, min, max }, props)
  )
    ? getClosestPoint(value, { step, min, max }, props)
    : 0;
  // console.log('ensureValuePrecision : ', closestPoint);
  // console.log('ensureValuePrecision step: ', step);
  return step
    ? parseFloat(closestPoint.toFixed(getPrecision(step)))
    : closestPoint;
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
  const { min, max } = props;
  let { value } = options;
  let calculateMin = min;
  let calculateMax = max;
  if (checkNeighbors(values)) {
    const prevValue = values?.[index - 1];
    const nextValue = values?.[index + 1];
    if (!isUndefined(prevValue)) {
      calculateMin = indent ? prevValue + indent : prevValue;
    }
    if (!isUndefined(nextValue)) {
      calculateMax = indent ? nextValue - indent : nextValue;
    }
    const icCorrect = indent && (prevValue || nextValue);
    if (icCorrect) {
      value = ensureValueInRange(value, {
        min: calculateMin,
        max: calculateMax,
      });
      calculateMin = min;
      calculateMax = max;
    }
  }
  return ensureValueInRange(value, {
    min: calculateMin,
    max: calculateMax,
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
  markValues = orderBy(markValues, [], ['asc']);
  return { ...props, values, mark: { ...mark, values: markValues } };
}

function getCount(props?: DefaultProps): number {
  return (props?.values || []).length;
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
  const { vertical, min, max, step } = props;
  const ratio = Math.abs(Math.max(offset, 0) / length);
  const value = vertical
    ? (1 - ratio) * (max - min) + min
    : ratio * (max - min) + min;
  const readyPrecision = step ? getPrecision(step) : 2;
  return Number(value.toFixed(readyPrecision));
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

function parseJSON(json?: unknown): undefined | unknown {
  let result: unknown;
  if (!isString(json) || !trim(json)) {
    return result;
  }
  if (json) {
    try {
      result = JSON.parse(json) as unknown;
    } catch (error) {
      result = undefined;
    }
  }
  return result;
}

function correctMin(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { key, values, props } = options;
  const { max } = props;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  const isNeedCorrect = Number.isNaN(readyValues) || readyValues >= max;
  if (isNeedCorrect && readyKey in props) {
    let readyValue = -max;
    if (!readyValue) {
      readyValue = defaultProps.min;
    }
    props.min = -readyValue;
  }
}

function correctMax(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { key, values, props } = options;
  const { min } = props;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  const isNeedCorrect = Number.isNaN(readyValues) || readyValues <= min;
  if (isNeedCorrect && readyKey in props) {
    let readyValue = 2 * Math.abs(min);
    if (!readyValue) {
      readyValue = defaultProps.max;
    }
    props.max = readyValue;
  }
}

function correctStep(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { key, values, props } = options;
  const { max } = props;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  const isNeedCorrect =
    Number.isNaN(readyValues) || readyValues < 0 || readyValues >= max;
  if (isNeedCorrect && readyKey in props) {
    props.step = defaultProps.step;
  }
}

function correctPrecision(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { key, values, props } = options;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  const isNeedCorrect =
    Number.isNaN(readyValues) || readyValues < 0 || readyValues > 100;
  if (isNeedCorrect && readyKey in props) {
    props.precision = defaultProps.precision;
  }
}

function correctIndent(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { key, values, props } = options;
  const { values: currentValues, max } = props;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  let isNeedCorrect = Number.isNaN(readyValues) || readyValues < 0;
  if (!isNeedCorrect) {
    const count = currentValues.length - 1;
    if (count * readyValues > max) {
      isNeedCorrect = true;
    }
  }
  if (isNeedCorrect && readyKey in props) {
    props.indent = defaultProps.indent;
  }
}

function correctClassNames(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}) {
  const { values, value, key } = options;
  let readyValue: string[] | undefined;
  if (value && Array.isArray(value)) {
    readyValue = value;
  }
  if (values && typeof values === 'object') {
    values[key] = readyValue;
  }
}

function isNeedCorrectStyle(style: unknown): boolean {
  return !isReallyObject(style);
}

function correctStyles(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}) {
  const { values, value, key } = options;
  let readyValue: Record<string, string>[] | undefined;
  if (value && Array.isArray(value)) {
    readyValue = value;
    value.forEach((style, index) => {
      if (isNeedCorrectStyle(style)) {
        readyValue?.splice(index);
      }
    });
  }
  if (values && typeof values === 'object') {
    values[key] = readyValue && readyValue?.length ? readyValue : undefined;
  }
}

function correctStyle(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}) {
  const { values, value, key } = options;
  let readyValue: Record<string, string> | undefined;
  if (isReallyObject(value)) {
    readyValue = value as Record<string, string>;
  }
  if (values && typeof values === 'object') {
    values[key] = readyValue;
  }
}

function correctClassName(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}) {
  const { values, value, key } = options;
  let readyValue: string | undefined;
  if (isString(value) && trim(value)) {
    readyValue = value;
  }
  if (values && typeof values === 'object') {
    values[key] = readyValue;
  }
}

function correctValues(options: {
  values?: Record<string, unknown>;
  key: string;
  props: DefaultProps;
  value?: unknown;
}) {
  const { values, value, key, props } = options;
  const { max, min } = props;
  let readyValue: number[] | undefined;
  if (Array.isArray(value) && value.length) {
    readyValue = value;
    value.forEach((temp, index) => {
      const isNeedCorrect = temp > max || temp < min;
      if (isNeedCorrect && Array.isArray(readyValue)) {
        readyValue[index] = min;
      }
    });
    readyValue = orderBy(readyValue, [], ['asc']);
  }
  if (values && typeof values === 'object') {
    values[key] = readyValue;
  }
}

function correctSet(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}) {
  const { values, props } = options;
  if (isObject(values) && isReallyObject(values)) {
    Object.keys(values).forEach((key: string) => {
      const readyKey = key as keyof typeof values;
      const value = values[readyKey];
      const readyValues = values as Record<string, string>;
      switch (key) {
        case 'classNames': {
          correctClassNames({ values: readyValues, key, value });
          break;
        }
        case 'styles': {
          correctStyles({ values: readyValues, key, value });
          break;
        }
        case 'style': {
          correctStyle({ values: readyValues, key, value });
          break;
        }
        case 'className':
        case 'wrapClassName': {
          correctClassName({ values: readyValues, key, value });
          break;
        }
        case 'values': {
          correctValues({ values: readyValues, key, value, props });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}

function correctData(props: DefaultProps): DefaultProps {
  const result = merge({}, props);
  Object.keys(result).forEach((key) => {
    const readyKey = key as keyof typeof result;
    const values = result[readyKey];
    switch (readyKey) {
      case 'min': {
        correctMin({ key: readyKey, props: result, values });
        break;
      }
      case 'max': {
        correctMax({ key: readyKey, props: result, values });
        break;
      }
      case 'step': {
        correctStep({ key: readyKey, props: result, values });
        break;
      }
      case 'precision': {
        correctPrecision({ key: readyKey, props: result, values });
        break;
      }
      case 'indent': {
        correctIndent({ key: readyKey, props: result, values });
        break;
      }
      default: {
        correctSet({ key: readyKey, props: result, values });
        break;
      }
    }
  });
  return result;
}

function prepareData(props?: Props, prevProps?: DefaultProps): DefaultProps {
  const values: number[] =
    props?.values || prevProps?.values || defaultProps.values;
  const mergeProps: DefaultProps = merge({}, defaultProps, prevProps, props);
  const correctedProps = correctData(mergeProps);
  // console.log('correctedProps : ', correctedProps);
  const readyProps = prepareValues({
    ...correctedProps,
    values,
  });
  return readyProps;
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

function isDirectionToMin(options: {
  value: number;
  props: DefaultProps;
  item: number;
}): boolean {
  const { value, props, item } = options;
  const { reverse } = props;
  const sign = reverse ? -1 : +1;
  const direction = (value - item) * sign;
  return direction < 0;
}

function getNearest({
  value,
  values,
  props,
}: {
  value: number;
  values: number[];
  props: DefaultProps;
}): {
  index: number;
  value: number;
} {
  let readyIndex = 0;
  let readyValue = values[0];
  let readyDifferent = Number.MAX_SAFE_INTEGER;
  values.forEach((item, index) => {
    const different = Math.abs(value - item);
    if (isDirectionToMin({ value, props, item })) {
      if (readyDifferent > different) {
        readyDifferent = different;
        readyIndex = index;
        readyValue = item;
      }
    } else if (readyDifferent >= different) {
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
  const { index } = getNearest({ value, values, props });
  return index;
}

function getCorrectIndex(options: {
  coordinateX: number;
  coordinateY: number;
  start: number;
  props: DefaultProps;
  length: number;
  index?: number;
}): { isCorrect: boolean; index: number } {
  const { index, ...other } = options;
  let readyIndex: number = index || 0;
  let isCorrect = false;
  const isNotCorrectIndex = isUndefined(index) || index < 0;
  if (isNotCorrectIndex) {
    readyIndex = getNearestIndex(other);
    isCorrect = true;
  } else if (!isUndefined(index)) {
    const { props } = other;
    const { values } = props;
    const currentValue = values[index];
    const previousValue = values[index - 1];
    const nextValue = values[index + 1];
    readyIndex = index;
    // console.log('currentValue : ', currentValue);
    // console.log('previousValue : ', previousValue);
    // console.log('nextValue : ', nextValue);
    if (currentValue === previousValue || currentValue === nextValue) {
      readyIndex = getNearestIndex(other);
      // console.log('readyIndex : ', getNearestIndex(other));
      isCorrect = true;
    }
  }
  return { index: readyIndex, isCorrect };
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
  getCorrectIndex,
};
