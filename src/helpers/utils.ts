import $ from 'jquery';
import orderBy from 'lodash.orderby';
import uniq from 'lodash.uniq';
import isUndefined from 'lodash.isundefined';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import trim from 'lodash.trim';
import isFunction from 'lodash.isfunction';

import { DefaultProps, Props } from '../types';

const defaultProps: DefaultProps = {
  prefixClassName: 'fsd-slider',
  values: [0],
  min: 0,
  max: 100,
  isDisabled: false,
  track: { isOn: true },
  rail: { isOn: true },
  isVertical: false,
  isReverse: false,
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

function calcOffset(options: {
  value: number;
  min: number;
  max: number;
  precision: number;
}): number {
  const { value, min, max, precision = 0 } = options;
  const ratio = (value - min) / (max - min);
  return Number(Math.max(0, ratio * 100).toFixed(precision));
}

function getHandleCenterPosition(options: {
  isVertical: boolean;
  handle: HTMLElement;
}): number {
  const { isVertical, handle } = options;
  const coords = handle.getBoundingClientRect();
  return isVertical
    ? coords.top + coords.height * 0.5
    : window.pageXOffset + coords.left + coords.width * 0.5;
}

function ensureValueInRange(options: {
  value: number;
  max: number;
  min: number;
}): number {
  const { value, min, max } = options;
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}

function getMousePosition(options: {
  isVertical: boolean;
  event: MouseEvent;
}): number {
  const { isVertical, event } = options;
  const { clientY = 0, pageX = 0 } = event || {};
  return isVertical ? clientY : pageX;
}

function getPrecision(step: number): number {
  const stepString = step.toString();
  let precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - 1 - stepString.indexOf('.');
  }
  return precision;
}

function getClosestPoint(options: {
  value: number;
  step: number;
  min: number;
  max: number;
  extraValues: number[] | undefined;
}): number {
  const { step, extraValues, max, min, value } = options;
  let points: number[] = [...(extraValues || [])];
  const maximumSteps = Math.floor((max - min) / step);
  const steps = Math.min((value - min) / step, maximumSteps);
  const closestStep = Math.round(steps) * step + min;
  points.push(closestStep);
  points = uniq(points);
  const diffs = points.map((point) => Math.abs(value - point));
  return points[diffs.indexOf(Math.min(...diffs))];
}

function ensureValuePrecision(options: {
  value: number;
  max: number;
  min: number;
  step: number | undefined;
  extraValues: number[] | undefined;
}): number {
  const { step, min, max, value, extraValues } = options;
  let closestPoint = value;
  if (step) {
    const temp = getClosestPoint({ value, step, min, max, extraValues });
    if (Number.isFinite(temp)) {
      closestPoint = parseFloat(temp.toFixed(getPrecision(step)));
    }
  }
  return closestPoint;
}

function checkNeighbors(value: number[]): boolean {
  return value.length > 1;
}

function ensureValueCorrectNeighbors(options: {
  value: number;
  min: number;
  max: number;
  index: number;
  values: number[];
  indent: number;
}): number {
  const { index, min, max, values, indent } = options;
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
    const isCorrect = prevValue || nextValue;
    if (isCorrect) {
      value = ensureValueInRange({
        value,
        min: calculateMin,
        max: calculateMax,
      });
    }
    calculateMin = min;
    calculateMax = max;
  }
  return ensureValueInRange({ value, min: calculateMin, max: calculateMax });
}

function calcValueWithEnsure(options: {
  value: number;
  min: number;
  max: number;
  values: number[];
  indent: number;
  index: number;
  step: number | undefined;
  extraValues: number[] | undefined;
}): number {
  let { value } = options;
  const { step, min, max, extraValues } = options;
  value = ensureValuePrecision({ value, max, min, step, extraValues });
  value = ensureValueCorrectNeighbors({ ...options, value });
  return value;
}

function prepareValues(props: DefaultProps): DefaultProps {
  let { values } = props;
  const { min, max, indent, step, mark } = props;
  const extraValues = mark?.values || [];
  if (!values.length) {
    values = defaultProps.values;
  }
  values = orderBy(values).map((value, index) =>
    calcValueWithEnsure({
      values,
      value,
      index,
      min,
      max,
      step,
      indent,
      extraValues,
    })
  );
  let markValues: number[] = extraValues.map((value) =>
    ensureValueInRange({ value, min, max })
  );
  markValues = orderBy(markValues, [], ['asc']);
  return { ...props, values, mark: { ...mark, values: markValues } };
}

function getSliderStart(
  options?: Partial<{
    isVertical: boolean;
    isReverse: boolean;
    view: JQuery<HTMLElement> | null;
  }>
): number {
  const { isReverse, isVertical, view } = options || {};
  if (view) {
    const rect = view.get(0).getBoundingClientRect();
    if (isVertical) {
      return isReverse ? rect.bottom : rect.top;
    }
    return window.pageXOffset + (isReverse ? rect.right : rect.left);
  }
  return 0;
}

function getSliderLength(options: {
  view?: JQuery<HTMLElement> | null;
  isVertical?: boolean;
}): number {
  const { view, isVertical } = options;
  if (!isUndefined(isVertical) && view) {
    const coords = view.get(0).getBoundingClientRect();
    return isVertical ? coords.height : coords.width;
  }
  return 0;
}

function calcValue(options: {
  offset: number;
  length: number;
  isVertical: boolean;
  min: number;
  max: number;
  step: number | undefined;
}): number {
  const { offset, length, isVertical, min, max, step } = options;
  const ratio = Math.abs(Math.max(offset, 0) / length);
  const value = isVertical
    ? (1 - ratio) * (max - min) + min
    : ratio * (max - min) + min;
  const readyPrecision = step ? getPrecision(step) : 2;
  return Number(value.toFixed(readyPrecision));
}

function calcValueByPos(options: {
  position: number;
  start: number;
  index: number;
  length: number;
  isVertical: boolean;
  isReverse: boolean;
  min: number;
  max: number;
  step: number | undefined;
  indent: number;
  values: number[];
  extraValues: number[] | undefined;
}): number {
  const {
    position,
    start,
    isReverse,
    min,
    max,
    isVertical,
    step,
    length,
    values,
    indent,
    index,
    extraValues,
  } = options;
  const sign = isReverse ? -1 : +1;
  const offset = sign * (position - start);
  let value = ensureValueInRange({
    value: calcValue({ step, max, min, length, isVertical, offset }),
    min,
    max,
  });
  value = calcValueWithEnsure({
    min,
    max,
    values,
    indent,
    index,
    step,
    extraValues,
    value,
  });
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

function correctMin(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { key, values, props } = options;
  const { max } = props;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  const isNeedCorrect =
    isUndefined(readyValues) || Number.isNaN(readyValues) || readyValues >= max;
  if (isNeedCorrect && readyKey in props) {
    let readyValue = -1 * max;
    if (!readyValue) {
      readyValue = defaultProps.min;
    }
    props.min = readyValue;
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
  const { max, min } = props;
  const readyKey = key as keyof typeof props;
  const readyValues = parseFloat(String(values));
  const isNeedCorrect =
    Number.isNaN(readyValues) ||
    readyValues >= Math.abs(max - min) ||
    readyValues < 0;
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
    if (count * readyValues > Math.abs(max)) {
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
}): void {
  const { values, value, key } = options;
  const readyValue: string[] | undefined | null = [];
  if (value && Array.isArray(value)) {
    value.forEach((className) => {
      const isNeedCorrect = !(isString(className) && trim(className));
      if (!isNeedCorrect) {
        readyValue.push(className);
      }
    });
  }
  if (values && typeof values === 'object') {
    values[key] = readyValue && readyValue.length ? readyValue : null;
  }
}

function isNeedCorrectStyle(style: unknown): boolean {
  return (
    !isReallyObject(style) ||
    (isReallyObject(style) && isObject(style) && !Object.keys(style).length)
  );
}

function correctStyles(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}): void {
  const { values, value, key } = options;
  const readyValue: Record<string, string>[] | undefined | null = [];
  if (value && Array.isArray(value)) {
    value.forEach((style) => {
      if (!isNeedCorrectStyle(style)) {
        readyValue.push(style);
      }
    });
  }
  const isCorrect = values && key in values;
  if (typeof values === 'object' && isCorrect) {
    values[key] = readyValue && readyValue?.length ? readyValue : null;
  }
}

function correctStyle(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}): void {
  const { values, value, key } = options;
  let readyValue: Record<string, string> | undefined | null = null;
  const isCorrect =
    isReallyObject(value) && isObject(value) && Object.keys(value).length;
  if (isCorrect) {
    readyValue = value as Record<string, string>;
  }
  const isCorrectObject = values && key in values;
  if (typeof values === 'object' && isCorrectObject) {
    values[key] = readyValue;
  }
}

function correctClassName(options: {
  values?: Record<string, unknown>;
  key: string;
  value?: unknown;
}): void {
  const { values, value, key } = options;
  let readyValue: string | undefined | null = null;
  if (isString(value) && trim(value)) {
    readyValue = value;
  }
  const isCorrectObject = values && key in values;
  if (isCorrectObject && typeof values === 'object') {
    values[key] = readyValue;
  }
}

function correctValues(options: {
  values?: Record<string, unknown>;
  key: string;
  props: DefaultProps;
  value?: unknown;
}): void {
  const { values, value, key, props } = options;
  const { max, min } = props;
  let readyValue: number[] | undefined = [];
  if (Array.isArray(value) && value.length) {
    readyValue = value.slice();
    value.forEach((temp, index) => {
      const isNeedCorrect =
        temp > max || temp < min || Number.isNaN(parseFloat(String(temp)));
      if (isNeedCorrect && Array.isArray(readyValue)) {
        readyValue[index] = min;
      }
    });
  }
  const isCorrectObject = values && key in values;

  if (isCorrectObject && typeof values === 'object') {
    if (readyValue.indexOf(min) === -1) {
      readyValue.push(min);
    }
    if (readyValue.indexOf(max) === -1) {
      readyValue.push(max);
    }
    values[key] = orderBy(readyValue, [], ['asc']);
  }
}

function correctIndex(options: {
  values?: unknown;
  key: string;
  props: DefaultProps;
}): void {
  const { values, props } = options;
  const { values: items = [] } = props;
  const readyValue: number | undefined | null = defaultProps.index;
  const readyValues = parseInt(String(values), 10);
  const isNeedCorrect =
    Number.isNaN(readyValues) ||
    Number(readyValues) < 0 ||
    Number(readyValues) > items.length - 1;
  if (isNeedCorrect) {
    props.index = readyValue;
  }
}

function correctRender(options: {
  values?: Record<string, unknown>;
  key: string;
  props: DefaultProps;
  value?: unknown;
}): void {
  const { values, value, key } = options;
  let readyValue: ((items: number) => void) | null | undefined = value as null;
  if (!isFunction(readyValue)) {
    readyValue = null;
  }
  const isCorrectObject = values && key in values;
  if (isCorrectObject && typeof values === 'object') {
    values[key] = readyValue;
  }
}

function correctSet(options: {
  key: string;
  props: DefaultProps;
  values: unknown;
}): void {
  const { values, props } = options;
  if (isObject(values) && isReallyObject(values)) {
    Object.keys(values).forEach((valuesKey: string) => {
      const readyKey = valuesKey as keyof typeof values;
      const value = values[readyKey];
      const readyValues = values as Record<string, string>;
      switch (readyKey) {
        case 'classNames': {
          correctClassNames({ values: readyValues, key: readyKey, value });
          break;
        }
        case 'styles': {
          correctStyles({ values: readyValues, key: readyKey, value });
          break;
        }
        case 'style': {
          correctStyle({ values: readyValues, key: readyKey, value });
          break;
        }
        case 'className':
        case 'wrapClassName': {
          correctClassName({ values: readyValues, key: readyKey, value });
          break;
        }
        case 'render': {
          correctRender({ values: readyValues, key: readyKey, value, props });
          break;
        }
        case 'values': {
          correctValues({ values: readyValues, key: readyKey, value, props });
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
  const result = $.extend(true, {}, props);
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
      case 'index': {
        correctIndex({ key: readyKey, props: result, values });
        break;
      }
      case 'classNames': {
        correctClassNames({ values: result, key, value: values });
        break;
      }
      case 'style': {
        correctStyle({ values: result, key, value: values });
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

function prepareData(props?: Props): DefaultProps {
  const correctedProps = correctData(
    $.extend(true, {}, { ...defaultProps, ...props })
  );
  return prepareValues(correctedProps);
}

function uniqId(): string {
  return Math.random().toString(16).substr(2);
}

function getPosition({
  isVertical = false,
  coordinateX = 0,
  coordinateY = 0,
}: {
  isVertical: boolean;
  coordinateX: number;
  coordinateY: number;
}): number {
  return isVertical ? coordinateY : coordinateX;
}

function isDirectionToMin(options: { value: number; item: number }): boolean {
  const { value, item } = options;
  const direction = value - item;
  return direction < 0;
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
    if (isDirectionToMin({ value, item })) {
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
  length: number;
  isVertical: boolean;
  min: number;
  max: number;
  step: number | undefined;
  values: number[];
  isReverse: boolean;
}): number {
  const {
    coordinateX,
    coordinateY,
    start,
    isReverse,
    min,
    max,
    values,
    isVertical,
    step,
    length,
  } = options;
  const position = getPosition({ isVertical, coordinateX, coordinateY });
  const sign = isReverse ? -1 : +1;
  const offset = sign * (position - start);
  const value = ensureValueInRange({
    value: calcValue({ step, min, max, length, isVertical, offset }),
    min,
    max,
  });
  const { index } = getNearest({ value, values });
  return index;
}

function getCorrectIndex(options: {
  coordinateX: number;
  coordinateY: number;
  start: number;
  length: number;
  index?: number;
  isVertical: boolean;
  min: number;
  max: number;
  step: number | undefined;
  values: number[];
  isReverse: boolean;
}): { isCorrect: boolean; index: number } {
  const { index, values } = options;
  let readyIndex: number = index || 0;
  let isCorrect = false;
  const isNotCorrectIndex = isUndefined(index) || index < 0;
  if (isNotCorrectIndex) {
    readyIndex = getNearestIndex(options);
    isCorrect = true;
  } else if (!isUndefined(index)) {
    const currentValue = values[index];
    const previousValue = values[index - 1];
    const nextValue = values[index + 1];
    readyIndex = index;
    if (currentValue === previousValue || currentValue === nextValue) {
      readyIndex = getNearestIndex(options);
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
  isDirectionToMin,
  correctData,
  correctSet,
  correctMin,
  correctMax,
  correctStep,
  correctPrecision,
  correctIndent,
  correctClassNames,
  isNeedCorrectStyle,
  correctStyles,
  correctStyle,
  correctClassName,
  correctValues,
  correctIndex,
  correctRender,
};
