import isString from 'lodash.isstring';
import trim from 'lodash.trim';
import isUndefined from 'lodash.isundefined';
import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';

import { Render, Style, Props, KeyProps } from '../../src/types';

function importAll(resolve: __WebpackModuleApi.RequireContext): void {
  resolve.keys().forEach(resolve);
}

function prepareJSON<T>(json?: unknown): undefined | null | T {
  let result: undefined | null | T;
  if (!isString(json) || !trim(json)) {
    return result;
  }
  if (json) {
    try {
      result = JSON.parse(json) as undefined;
    } catch (error) {
      result = null;
    }
  }
  return result;
}

function prepareFunction(string?: unknown): null | undefined | Render {
  let result: null | undefined | Render;
  if (!isString(string) || !trim(string)) {
    return null;
  }
  try {
    result = new Function('v', string) as Render;
    result(0);
  } catch (error) {
    result = null;
  }
  if (isFunction(result)) {
    return result;
  }
  return null;
}

function prepareArray<T>(string?: unknown): T[] | null {
  const result = prepareJSON(string);
  if (Array.isArray(result)) {
    return result as T[];
  }
  return null;
}

function isResult(
  result: string[] | Render | Style | undefined | null
): boolean {
  if (result) {
    if (Array.isArray(result)) {
      return false;
    }
    if (isFunction(result)) {
      return false;
    }
    return isObject(result);
  }
  return false;
}

function prepareObject(
  string?: unknown
): string[] | Style | Render | undefined | null {
  const result = prepareJSON<string[] | Render | Style | null | undefined>(
    string
  );
  if (result && isResult(result)) {
    return result;
  }
  return null;
}

function valueToProp(options?: {
  value?: unknown;
  property?: string;
}): unknown {
  const { value, property } = options || {};
  let readyValue = value;
  if (isUndefined(readyValue)) {
    return null;
  }
  switch (property) {
    case 'values': {
      if (Array.isArray(value)) {
        return value as number[];
      }
      return null;
    }
    case 'index': {
      if (
        Number.isNaN(Number(readyValue)) ||
        Number.isNaN(parseFloat(String(readyValue)))
      ) {
        return null;
      }
      return parseFloat(String(readyValue)) - 1;
    }
    case 'min':
    case 'max':
    case 'step':
    case 'precision':
    case 'indent': {
      if (
        Number.isNaN(Number(readyValue)) ||
        Number.isNaN(parseFloat(String(readyValue)))
      ) {
        return null;
      }
      return parseFloat(String(readyValue));
    }
    case 'isDisabled':
    case 'isVertical':
    case 'isReverse':
    case 'isFocused':
    case 'isOn':
    case 'dot':
    case 'always': {
      readyValue = Boolean(parseInt(String(readyValue), 10));
      return readyValue;
    }
    case 'classNames':
    case 'styles': {
      return prepareArray<string>(readyValue);
    }
    case 'className':
    case 'wrapClassName': {
      if (!isString(readyValue) || !trim(readyValue)) {
        return null;
      }
      return trim(readyValue);
    }
    case 'style': {
      return prepareObject(readyValue);
    }
    case 'render': {
      return prepareFunction(readyValue);
    }
    default: {
      return null;
    }
  }
}

function prepareValues(
  options?: Partial<{
    value: unknown;
    type: KeyProps;
    property: string;
    values: Props;
  }>
): Props | undefined {
  const { value, type, property, values } = options || {};
  if (!type || !property) {
    return values;
  }
  if (property === 'values') {
    const isCorrectValue =
      value !== null && !isUndefined(value) && Array.isArray(value);
    if (type === 'values' && isCorrectValue) {
      return {
        ...values,
        values: [...(value as number[])],
      };
    }
    if (type === 'mark' && isCorrectValue) {
      return {
        ...values,
        mark: {
          ...(values?.mark || {}),
          values: [...(value as number[])],
        },
      };
    }
  } else if (
    [
      'min',
      'max',
      'step',
      'isDisabled',
      'isVertical',
      'isReverse',
      'precision',
      'indent',
      'isFocused',
      'index',
    ].indexOf(property) !== -1
  ) {
    return {
      ...values,
      [property]: value,
    };
  } else {
    return {
      ...values,
      [type]: {
        ...((values || {})[type] as { key: keyof Props }),
        [property]: value,
      },
    };
  }
  return values;
}

function extractFunctionBody(callback?: unknown): string | undefined | null {
  if (isFunction(callback)) {
    const entire = callback.toString();
    return entire.slice(entire.indexOf('{') + 1, entire.lastIndexOf('}'));
  }
  return null;
}

function propsToValue(
  options?: Partial<{
    type: string;
    property: string;
    values: Props | null;
  }>
): unknown {
  const { type, property, values } = options || {};
  const isCorrect = values && isObject(values) && trim(type) && trim(property);
  if (values && isCorrect) {
    let value: unknown;
    const readyType = type as keyof Props;
    if (type === property) {
      value = values[readyType];
    } else {
      const temp = values[readyType];
      if (temp && isObject(temp)) {
        const readyProperty = property as keyof typeof temp;
        value = temp[readyProperty];
      }
    }
    switch (property) {
      case 'values': {
        return value;
      }
      case 'isOn': {
        return Number(value);
      }
      case 'render': {
        return extractFunctionBody(value);
      }
      case 'style':
      case 'classNames': {
        return value ? JSON.stringify(value) : '';
      }
      case 'index': {
        return value ? parseFloat(String(value)) + 1 : 0;
      }
      default: {
        return isUndefined(value) || value === null ? '' : value;
      }
    }
  }
  return undefined;
}

function excludeProps(options: Props): Props {
  let props = $.extend(true, {}, options);
  props = omit(props, [
    'prefixClassName',
    'onBeforeChange',
    'onChange',
    'onAfterChange',
  ]);
  return props;
}

function checkedIsEqual(options?: {
  prev?: unknown | null;
  next?: unknown | null;
}): boolean {
  const { prev, next } = options || {};
  let readyPrev = prev as Props;
  let readyNext = next as Props;
  if (isObject(readyPrev) && isObject(readyNext)) {
    readyPrev = excludeProps(readyPrev);
    const { tooltip: tooltipPrev, mark: markPrev } = readyPrev;
    const readyTooltipRenderPrev = tooltipPrev?.render;
    const readyMarkRenderPrev = markPrev?.render;
    readyNext = excludeProps(readyNext);
    const { tooltip: tooltipNext, mark: markNext } = readyNext;
    const readyTooltipRenderNext = tooltipNext?.render;
    const readyMarkRenderNext = markNext?.render;
    if (
      JSON.stringify(readyTooltipRenderPrev) ===
      JSON.stringify(readyTooltipRenderNext)
    ) {
      readyPrev.tooltip = omit(tooltipPrev, ['render']);
      readyNext.tooltip = omit(tooltipNext, ['render']);
    }
    if (
      JSON.stringify(readyMarkRenderPrev) ===
      JSON.stringify(readyMarkRenderNext)
    ) {
      readyPrev.mark = omit(markPrev, ['render']);
      readyNext.mark = omit(markNext, ['render']);
    }
  }
  return isEqual(readyPrev, readyNext);
}

export {
  importAll,
  prepareJSON,
  valueToProp,
  prepareArray,
  prepareFunction,
  prepareValues,
  propsToValue,
  checkedIsEqual,
};
