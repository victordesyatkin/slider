import $ from 'jquery';
import orderBy from 'lodash.orderby';
import uniq from 'lodash.uniq';
import isUndefined from 'lodash.isundefined';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import trim from 'lodash.trim';
import isFunction from 'lodash.isfunction';

import {
  DefaultProps,
  Props,
  Style,
  Track,
  Rail,
  Dot,
  Mark,
  Tooltip,
  Handle,
  Render,
} from '../types';

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
  precision?: number;
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
  extraValues: number[] | undefined | null;
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

function checkIsCorrectStep(step: number | undefined): boolean {
  return Boolean(step) && typeof step === 'number';
}

function ensureValuePrecision(options: {
  value: number;
  max: number;
  min: number;
  step: number | undefined;
  extraValues: number[] | undefined | null;
}): number {
  const { step, min, max, value, extraValues } = options;
  let closestPoint = value;
  if (step && checkIsCorrectStep(step)) {
    const temporaryClosestPoint = getClosestPoint({
      value,
      step,
      min,
      max,
      extraValues,
    });
    if (Number.isFinite(temporaryClosestPoint)) {
      const precision = getPrecision(step);
      closestPoint = parseFloat(temporaryClosestPoint.toFixed(precision));
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
  const { index, min, max, values, indent, value } = options;
  let temporary = value;
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
      temporary = ensureValueInRange({
        value,
        min: calculateMin,
        max: calculateMax,
      });
    }
    calculateMin = min;
    calculateMax = max;
  }
  return ensureValueInRange({
    value: temporary,
    min: calculateMin,
    max: calculateMax,
  });
}

function calcValueWithEnsure(options: {
  value: number;
  min: number;
  max: number;
  values: number[];
  indent: number;
  index: number;
  step: number | undefined;
  extraValues: number[] | undefined | null;
}): number {
  const { value } = options;
  const { step, min, max, extraValues } = options;
  const temporary = ensureValuePrecision({
    value,
    max,
    min,
    step,
    extraValues,
  });
  return ensureValueCorrectNeighbors({ ...options, value: temporary });
}

function prepareValues(props: DefaultProps): DefaultProps {
  const { values } = props;
  let temporary = values;
  const { min, max, indent, step, mark } = props;
  const extraValues = mark?.values || [];
  if (!values.length) {
    temporary = defaultProps.values;
  }
  temporary = orderBy(temporary).map((value, index) =>
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
  return { ...props, values: temporary, mark: { ...mark, values: markValues } };
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
  extraValues: number[] | undefined | null;
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
  const temporary = ensureValueInRange({
    value: calcValue({ step, max, min, length, isVertical, offset }),
    min,
    max,
  });
  return calcValueWithEnsure({
    min,
    max,
    values,
    indent,
    index,
    step,
    extraValues,
    value: temporary,
  });
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

function correctMin(options: { max: number; min: number }): number {
  const { min, max } = options;
  let readyMin = parseFloat(String(min));
  const isNeedCorrect =
    isUndefined(readyMin) || Number.isNaN(readyMin) || readyMin >= max;
  if (isNeedCorrect) {
    readyMin = -1 * max;
    if (isUndefined(readyMin) || Number.isNaN(readyMin)) {
      readyMin = defaultProps.min;
    }
  }
  return readyMin;
}

function correctMax(options: { min: number; max: number }): number {
  const { min, max } = options;
  let readyMax = parseFloat(String(max));
  const isNeedCorrect = Number.isNaN(readyMax) || readyMax <= min;
  if (isNeedCorrect) {
    readyMax = 2 * Math.abs(min);
    const withDefaultMax =
      readyMax === min || isUndefined(readyMax) || Number.isNaN(readyMax);
    if (withDefaultMax) {
      readyMax = defaultProps.max;
    }
  }
  return readyMax;
}

function correctStep(options: {
  min: number;
  max: number;
  step: number | undefined | null;
}): number {
  const { max, min, step } = options;
  let readyStep = parseFloat(String(step));
  const isNeedCorrect =
    Number.isNaN(readyStep) ||
    readyStep >= Math.abs(max - min) ||
    readyStep < 0;
  if (isNeedCorrect) {
    readyStep = defaultProps.step;
  }
  return readyStep;
}

function correctPrecision(options: { precision: number }): number {
  const { precision } = options;
  const readyPrecision = parseFloat(String(precision));
  const isNeedCorrect =
    Number.isNaN(readyPrecision) || readyPrecision < 0 || readyPrecision > 100;
  if (isNeedCorrect) {
    return defaultProps.precision;
  }
  return readyPrecision;
}

function correctIndent(options: {
  indent: number;
  values: number[];
  max: number;
}): number {
  const { values, max, indent } = options;
  const readyIndent = parseFloat(String(indent));
  let isNeedCorrect = Number.isNaN(readyIndent) || readyIndent < 0;
  if (!isNeedCorrect) {
    const count = values.length - 1;
    if (count * readyIndent > Math.abs(max)) {
      isNeedCorrect = true;
    }
  }
  if (isNeedCorrect) {
    return defaultProps.indent;
  }
  return readyIndent;
}

function correctClassNames(
  options?: Partial<{
    classNames: string[] | null;
  }>
): string[] | null {
  const { classNames } = options || {};
  const readyClassNames: string[] | null = [];
  if (classNames && Array.isArray(classNames)) {
    classNames.forEach((className) => {
      const isCorrect = isString(className) && trim(className);
      if (isCorrect && readyClassNames) {
        readyClassNames.push(className);
      }
    });
  }
  if (readyClassNames?.length) {
    return readyClassNames;
  }
  return null;
}

function isNeedCorrectStyle(style: Style | null): boolean {
  return (
    !isReallyObject(style) ||
    (isReallyObject(style) && isObject(style) && !Object.keys(style).length)
  );
}

function correctStyles(
  options?: Partial<{
    styles: Style[] | null;
  }>
): Style[] | null {
  const { styles } = options || {};
  const readyStyles: Style[] = [];
  if (styles && Array.isArray(styles)) {
    styles.forEach((style) => {
      if (!isNeedCorrectStyle(style)) {
        readyStyles.push(style);
      }
    });
  }
  if (readyStyles?.length) {
    return readyStyles;
  }
  return null;
}

function correctStyle(
  options?: Partial<{
    style: Style | null;
  }>
): Style | null {
  const { style } = options || {};
  const isCorrect =
    isReallyObject(style) && isObject(style) && Object.keys(style).length;
  if (isCorrect) {
    return style as Style;
  }
  return null;
}

function correctClassName(
  options?: Partial<{
    className: string | null;
  }>
): string | null {
  const { className } = options || {};
  if (isString(className) && trim(className)) {
    return className;
  }
  return null;
}

function correctWrapClassName(
  options?: Partial<{
    wrapClassName: string | null;
  }>
): string | null {
  const { wrapClassName } = options || {};
  if (isString(wrapClassName) && trim(wrapClassName)) {
    return wrapClassName;
  }
  return null;
}

function correctValues(
  options?: Partial<{
    values?: number[] | null;
    min: number;
    max: number;
  }>
): number[] | null {
  const { values, max, min } = options || {};
  let readyValues: number[] = [];
  if (isUndefined(max)) {
    return null;
  }
  if (isUndefined(min)) {
    return null;
  }
  if (Array.isArray(values)) {
    values.forEach((temp, index) => {
      let isNeedCorrect = Number.isNaN(parseFloat(String(temp)));
      if (!isNeedCorrect && typeof temp === 'number') {
        isNeedCorrect = temp > max || temp < min;
      } else {
        isNeedCorrect = true;
      }
      if (isNeedCorrect) {
        readyValues[index] = min;
      } else if (typeof temp === 'number') {
        readyValues[index] = temp;
      }
    });
  }
  if (readyValues) {
    if (readyValues.indexOf(min) === -1) {
      readyValues.push(min);
    }
    if (readyValues.indexOf(max) === -1) {
      readyValues.push(max);
    }
    readyValues = orderBy(readyValues, [], ['asc']);
  }
  return readyValues;
}

function correctIndex(
  options?: Partial<{
    index: number | null;
    values: number[] | null;
  }>
): number | undefined {
  const { values, index } = options || {};
  const readyIndex: number | undefined = parseInt(String(index), 10);
  const isNeedCorrect =
    Number.isNaN(readyIndex) ||
    readyIndex < 0 ||
    readyIndex > (values || []).length - 1;
  if (isNeedCorrect) {
    return defaultProps.index;
  }
  return readyIndex;
}

function correctRender(
  options?: Partial<{
    render: Render | null;
  }>
): Render | null {
  const { render } = options || {};
  if (isFunction(render)) {
    return render;
  }
  return null;
}

function correctIsOn(options?: Partial<{ isOn?: boolean }>): boolean {
  const { isOn } = options || {};
  return Boolean(isOn);
}

function correctWithDot(options?: Partial<{ withDot?: boolean }>): boolean {
  const { withDot } = options || {};
  return Boolean(withDot);
}

function correctIsAlways(options?: Partial<{ isAlways?: boolean }>): boolean {
  const { isAlways } = options || {};
  return Boolean(isAlways);
}

function correctTrack(options?: Partial<{ entity: Track }>): Track | undefined {
  const { entity } = options || {};
  if (isObject(entity) && isReallyObject(entity)) {
    Object.keys(entity).forEach((key) => {
      const castKey = key as keyof typeof entity;
      switch (castKey) {
        case 'classNames': {
          const value = entity[castKey];
          entity[castKey] = correctClassNames({ classNames: value });
          break;
        }
        case 'styles': {
          const value = entity[castKey];
          entity[castKey] = correctStyles({ styles: value });
          break;
        }
        case 'isOn': {
          const value = entity[castKey];
          entity[castKey] = correctIsOn({ isOn: value });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  return entity;
}

function correctHandle(
  options?: Partial<{ entity: Handle }>
): Handle | undefined {
  const { entity } = options || {};
  if (isObject(entity) && isReallyObject(entity)) {
    Object.keys(entity).forEach((key) => {
      const castKey = key as keyof typeof entity;
      switch (castKey) {
        case 'classNames': {
          const value = entity[castKey];
          entity[castKey] = correctClassNames({ classNames: value });
          break;
        }
        case 'styles': {
          const value = entity[castKey];
          entity[castKey] = correctStyles({ styles: value });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  return entity;
}

function correctMark(
  options?: Partial<{ entity: Mark; min: number; max: number }>
): Mark | undefined {
  const { entity, min, max } = options || {};
  if (isObject(entity) && isReallyObject(entity)) {
    Object.keys(entity).forEach((key) => {
      const castKey = key as keyof typeof entity;
      switch (castKey) {
        case 'isOn': {
          const value = entity[castKey];
          entity[castKey] = correctIsOn({ isOn: value });
          break;
        }
        case 'className': {
          const value = entity[castKey];
          entity[castKey] = correctClassName({ className: value });
          break;
        }
        case 'style': {
          const value = entity[castKey];
          entity[castKey] = correctStyle({ style: value });
          break;
        }
        case 'withDot': {
          const value = entity[castKey];
          entity[castKey] = correctWithDot({ withDot: value });
          break;
        }
        case 'render': {
          const value = entity[castKey];
          entity[castKey] = correctRender({ render: value });
          break;
        }
        case 'values': {
          const value = entity[castKey];
          entity[castKey] = correctValues({ values: value, min, max });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  return entity;
}

function correctDot(options?: Partial<{ entity: Dot }>): Dot | undefined {
  const { entity } = options || {};
  if (isObject(entity) && isReallyObject(entity)) {
    Object.keys(entity).forEach((key) => {
      const castKey = key as keyof typeof entity;
      switch (castKey) {
        case 'isOn': {
          const value = entity[castKey];
          entity[castKey] = correctIsOn({ isOn: value });
          break;
        }
        case 'className': {
          const value = entity[castKey];
          entity[castKey] = correctClassName({ className: value });
          break;
        }
        case 'wrapClassName': {
          const value = entity[castKey];
          entity[castKey] = correctWrapClassName({
            wrapClassName: value,
          });
          break;
        }
        case 'style': {
          const value = entity[castKey];
          entity[castKey] = correctStyle({ style: value });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  return entity;
}

function correctTooltip(
  options?: Partial<{ entity: Tooltip }>
): Tooltip | undefined {
  const { entity } = options || {};
  if (isObject(entity) && isReallyObject(entity)) {
    Object.keys(entity).forEach((key) => {
      const castKey = key as keyof typeof entity;
      switch (castKey) {
        case 'isOn': {
          const value = entity[castKey];
          entity[castKey] = correctIsOn({ isOn: value });
          break;
        }
        case 'className': {
          const value = entity[castKey];
          entity[castKey] = correctClassName({ className: value });
          break;
        }
        case 'style': {
          const value = entity[castKey];
          entity[castKey] = correctStyle({ style: value });
          break;
        }
        case 'render': {
          const value = entity[castKey];
          entity[castKey] = correctRender({ render: value });
          break;
        }
        case 'isAlways': {
          const value = entity[castKey];
          entity[castKey] = correctIsAlways({ isAlways: value });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  return entity;
}

function correctRail(options?: Partial<{ entity: Rail }>): Rail | undefined {
  const { entity } = options || {};
  if (isObject(entity) && isReallyObject(entity)) {
    Object.keys(entity).forEach((key) => {
      const castKey = key as keyof typeof entity;
      switch (castKey) {
        case 'isOn': {
          const value = entity[castKey];
          entity[castKey] = correctIsOn({ isOn: value });
          break;
        }
        case 'className': {
          const value = entity[castKey];
          entity[castKey] = correctClassName({ className: value });
          break;
        }
        case 'style': {
          const value = entity[castKey];
          entity[castKey] = correctStyle({ style: value });
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  return entity;
}

function correctData(props: DefaultProps): DefaultProps {
  const result = $.extend(true, {}, props);
  Object.keys(result).forEach((key) => {
    const castKey = key as keyof typeof result;
    switch (castKey) {
      case 'min': {
        const { max, min } = result;
        result[castKey] = correctMin({ min, max });
        break;
      }
      case 'max': {
        const { max, min } = result;
        result[castKey] = correctMax({ min, max });
        break;
      }
      case 'step': {
        const { max, min, step } = result;
        result[castKey] = correctStep({ step, min, max });
        break;
      }
      case 'precision': {
        const { precision } = result;
        result[castKey] = correctPrecision({
          precision,
        });
        break;
      }
      case 'indent': {
        const { indent, max, values } = result;
        result[castKey] = correctIndent({ indent, max, values });
        break;
      }
      case 'index': {
        const { index, values } = result;
        result[castKey] = correctIndex({ values, index });
        break;
      }
      case 'classNames': {
        const { classNames } = result;
        result[castKey] = correctClassNames({
          classNames,
        });
        break;
      }
      case 'style': {
        const { style } = result;
        result[castKey] = correctStyle({ style });
        break;
      }
      case 'track': {
        const entity = result[castKey];
        result[castKey] = correctTrack({
          entity,
        });
        break;
      }
      case 'handle': {
        const entity = result[castKey];
        result[castKey] = correctHandle({
          entity,
        });
        break;
      }
      case 'mark': {
        const { min, max } = result;
        const entity = result[castKey];
        result[castKey] = correctMark({
          entity,
          max,
          min,
        });
        break;
      }
      case 'dot': {
        const entity = result[castKey];
        result[castKey] = correctDot({
          entity,
        });
        break;
      }
      case 'tooltip': {
        const entity = result[castKey];
        result[castKey] = correctTooltip({
          entity,
        });
        break;
      }
      case 'rail': {
        const entity = result[castKey];
        result[castKey] = correctRail({
          entity,
        });
        break;
      }
      default: {
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
  isNeedCorrectStyle,
  checkIsCorrectStep,
  correctData,
  correctMin,
  correctMax,
  correctStep,
  correctPrecision,
  correctIndent,
  correctClassNames,
  correctStyles,
  correctStyle,
  correctClassName,
  correctValues,
  correctIndex,
  correctRender,
  correctDot,
  correctMark,
  correctTooltip,
  correctHandle,
  correctRail,
  correctTrack,
  correctIsAlways,
  correctIsOn,
  correctWithDot,
  correctWrapClassName,
};
