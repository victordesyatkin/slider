import $ from 'jquery';
import bind from 'bind-decorator';
import set from 'lodash.set';
import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';
import trim from 'lodash.trim';
import isUndefined from 'lodash.isundefined';
import isString from 'lodash.isstring';
import merge from 'lodash.merge';
import orderBy from 'lodash.orderby';

import { uniqId, ensureValueInRange } from '../src/helpers/utils';
import { Style, Render, Props, KeyProps } from '../src/types';
import Slider from '../src/index';
import './components/example/example';
import './index.scss';

class Example {
  private $parent: JQuery<HTMLElement>;

  private $sliderWrapper: JQuery<HTMLElement>;

  private $sections: JQuery<HTMLElement>;

  private slider?: Slider;

  private props?: Props;

  private cache: Record<string, JQuery<HTMLElement>> = {};

  constructor(parent: HTMLElement) {
    this.$parent = $(parent);
    this.$sliderWrapper = $('.js-slider__dummy', this.$parent);
    this.$sections = $('.js-section', this.$parent);
    this.init();
  }

  private static prepareFunction(string?: unknown): undefined | Render {
    let result: undefined | Render;
    if (!isString(string) || !trim(string)) {
      return result;
    }
    try {
      result = new Function('v', string) as Render;
      result(0);
    } catch (error) {
      result = undefined;
    }
    if (isFunction(result)) {
      return result;
    }
    return result;
  }

  private static prepareArray(string?: unknown): undefined | string[] {
    const result = Example.prepareJSON(string);
    if (Array.isArray(result)) {
      return result;
    }
    return undefined;
  }

  private static isResult(
    result: string[] | Render | Style | undefined
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

  private static prepareObject(
    string?: unknown
  ): string[] | Style | Render | undefined {
    const result = Example.prepareJSON(string);
    if (Example.isResult(result)) {
      return result;
    }
    return undefined;
  }

  private static prepareJSON(
    json?: unknown
  ): undefined | Style | string[] | Render {
    let result: undefined | Style | string[] | Render;
    if (!isString(json) || !trim(json)) {
      return result;
    }
    if (json) {
      try {
        result = JSON.parse(json) as undefined;
      } catch (error) {
        result = undefined;
      }
    }
    return result;
  }

  private static updateHandle(index: number, element: HTMLElement) {
    const $element = $(element);
    const $inputControl = $('.js-input', $element);
    if (index === 0) {
      $element.addClass(['section__item_first', 'js-section__item_first']);
      $inputControl.addClass(['input_first', 'js-input_first']);
    } else {
      $element.removeClass(['section__item_first', 'js-section__item_first']);
      $inputControl.removeClass(['input_first', 'js-input_first']);
    }
    $inputControl.attr({ 'data-key': index });
    const $span = $('.js-input__section-key', $element);
    $span.text(`${index + 1}:`);
  }

  private static updateHandles(currentTarget: HTMLElement) {
    $('.js-section__item_control', currentTarget).each(Example.updateHandle);
  }

  private static extractFunctionBody(callback?: unknown): string | undefined {
    let result: string | undefined;
    if (isFunction(callback)) {
      const entire = callback.toString();
      return entire.slice(entire.indexOf('{') + 1, entire.lastIndexOf('}'));
    }
    return result;
  }

  private static extractValue(options: {
    values: unknown;
    property: string;
    index: number;
  }): string | number | undefined | boolean {
    const { values, property, index } = options;
    let value: string | number | undefined | boolean = '';
    const isCorrectObject =
      isObject(values) && !Array.isArray(values) && !isFunction(values);
    const isCorrectType =
      typeof values === 'string' ||
      typeof values === 'boolean' ||
      typeof values === 'number' ||
      typeof values === 'undefined';
    if (isCorrectObject && typeof values === 'object') {
      const readyProperty = property as keyof typeof values;
      const temp = values?.[readyProperty];
      if (isObject(temp) || isFunction(temp)) {
        if (Array.isArray(temp) && property === 'values') {
          const readyIndex = index as keyof typeof temp;
          value = temp[readyIndex];
        } else if (isFunction(temp)) {
          const readyTemp = temp as () => void;
          value = Example.extractFunctionBody(readyTemp);
        } else {
          value = JSON.stringify(temp);
        }
      } else {
        value = temp;
      }
    } else if (Array.isArray(values) || isFunction(values)) {
      value = JSON.stringify(values);
    } else if (isCorrectType) {
      value = values as number;
    }
    return value;
  }

  private init(): void {
    this.slider = this.$sliderWrapper
      .slider({
        onAfterChange: this.onAfterChange,
        onChange: this.onAfterChange,
      })
      .data(Slider.PLUGIN_NAME) as Slider;
    this.initHandlers();
    this.initCache();
    this.updateProps();
  }

  private initHandlers() {
    this.$sections.each(this.initHandler);
  }

  private initCache() {
    this.cache = {};
    let index = 0;
    $('.js-input').each((_: number, element: HTMLElement) => {
      const $element = $(element);
      const data = $element.data('data') as
        | {
            type: string;
            property: string;
          }
        | undefined;
      if (data) {
        const type = data?.type as keyof Omit<Props, 'values'>;
        const property = data?.property;
        if (property !== 'values') {
          index = 0;
        }
        this.cache[`${type}-${property}-${index}`] = $element;
        if (property === 'values') {
          index += 1;
        }
      }
    });
    // console.log('this.cache : ', this.cache);
  }

  @bind
  private initHandler(index: number, element: HTMLElement) {
    $(element).on({ click: this.handleSectionClick });
    $(element).on({ input: this.handleSectionInput });
    $(element).on({ focusout: this.handleSectionFocusout });
  }

  private getProps(): Props {
    this.props = {};
    this.$sections.each(this.processingSection);
    return this.props;
  }

  private setProps(): void {
    if (this.props && this.slider) {
      // console.log('set props : ', this.props);
      this.slider.setProps(this.props);
      const props = this.slider.getProps();
      // console.log('got props : ', props);
      this.updateSections(props);
    }
  }

  private updateProps(): void {
    const props = merge({}, this.props);
    this.getProps();
    if (this.checkNeedUpdate(props)) {
      this.setProps();
    }
  }

  private checkNeedUpdate(props?: Props): boolean {
    const prev = JSON.stringify(props);
    const next = JSON.stringify(this.props);
    if (prev !== next) {
      return true;
    }
    return false;
  }

  private updateSections(props: Props): void {
    if (this.checkNeedUpdate(props)) {
      this.props = props;
      const { values, ...other } = props;
      // console.log('this.cache : ', this.cache);
      Object.keys(this.cache).forEach((key) => {
        this.updateSection({ key, props: other });
      });
      if (values) {
        $('.js-input_control', this.$sections).each(
          (index, element: HTMLElement) => {
            if ($(element) && $(element).data) {
              if ($(element).data('data')) {
                const data = $(element).data('data') as {
                  type: string | undefined;
                };
                const type = data?.type as string;
                if (type === 'values') {
                  $('.js-input__input', element).val(values[index]);
                }
              }
            }
          }
        );
      }
    }
  }

  @bind
  private updateSection(options: {
    key: string;
    props: Omit<Props, 'values'>;
  }) {
    const { key, props } = options;
    const parts = key.split('-');
    const [type, property, index] = parts;
    if (type && property) {
      const readyType = type as keyof Omit<Props, 'values'>;
      const values = props[readyType];
      if (!isUndefined(values)) {
        const $item = this.cache[key];
        const $input = $('.js-input__input', $item);
        let value = Example.extractValue({
          values,
          property,
          index: Number(index),
        });
        // console.log('type : ', type);
        // console.log('values : ', values);
        // console.log('property : ', property);
        // console.log('value : ', value);
        // console.log('$input : ', $input);
        switch (property) {
          case 'min':
          case 'max':
          case 'step':
          case 'precision':
          case 'indent':
          case 'values': {
            value = parseFloat(String(value)) || 0;
            // console.log('value1 : ', value);
            $input.val(value);
            break;
          }
          case 'disabled':
          case 'vertical':
          case 'reverse':
          case 'isFocused':
          case 'on':
          case 'dot':
          case 'always': {
            value = Number(value);
            $input.val(value);
            $input.prop('checked', Boolean(value));
            break;
          }
          case 'classNames':
          case 'styles':
          case 'className':
          case 'style':
          case 'wrapClassName':
          case 'render': {
            value = isUndefined(value) ? '' : String(value);
            $input.val(value);
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  @bind
  private onAfterChange(values?: number[]): void {
    if (!values || !this.props) {
      return;
    }
    const prev = JSON.stringify(orderBy(this.props?.values || [], [], ['asc']));
    const next = JSON.stringify(orderBy(values || [], [], ['asc']));
    if (next === prev) {
      return;
    }
    const props = merge({}, this.props);
    set(props, ['values'], values);
    console.log('onAfterChange : ', values);
    this.updateSections(props);
  }

  @bind
  private handleSectionClick(event: JQuery.EventBase): void {
    const target = event?.target as HTMLElement;
    const currentTarget = event?.currentTarget as HTMLElement;
    if (target) {
      this.removeHandle(target, currentTarget);
      this.addHandle(target, currentTarget);
    }
  }

  @bind
  private handleSectionInput(event: JQuery.EventBase) {
    const target: HTMLElement = event?.target as HTMLElement;
    if (target && $(target).attr('type') === 'checkbox') {
      this.updateProps();
    }
  }

  @bind
  private handleSectionFocusout(event: JQuery.EventBase) {
    const target: HTMLElement = event?.target as HTMLElement;
    if (
      target &&
      ['number', 'text'].indexOf($(target).attr('type') || '') !== -1
    ) {
      this.updateProps();
    }
  }

  private getSectionItems = (currentTarget: HTMLElement): JQuery<HTMLElement> =>
    $('.js-section__item_control', currentTarget);

  private addHandle(target: HTMLElement, currentTarget: HTMLElement): void {
    if ($(target).closest('.js-button_add').length) {
      const $items = this.getSectionItems(currentTarget);
      if ($items.length > 0) {
        const $lastItem = $($items.slice(-1));
        const $last = $lastItem.clone();
        $last.removeClass('section__item_first');
        const $inputControl = $('.js-input', $last);
        $inputControl.removeClass('input_first');
        let key = ($inputControl.data('key') || 0) as number;
        key += 1;
        $inputControl.attr({ 'data-key': key });
        const $span = $('.js-input__section-key', $last);
        $span.text(`${key + 1}:`);
        const $input = $('.js-input__input', $last);
        $input.attr({ id: uniqId() });
        const max = this.props?.max || 0;
        const min = this.props?.min || 0;
        const value =
          parseFloat(String($('.js-input__input', $lastItem).val())) +
          (max - min) * 1e-1;
        if (!isUndefined(value) && !Number.isNaN(value)) {
          $input.val(ensureValueInRange(value, { max, min }));
        }
        $lastItem.after($last);
        this.updateProps();
      }
    }
  }

  private removeHandle(target: HTMLElement, currentTarget: HTMLElement): void {
    if ($(target).closest('.js-button_remove').length) {
      const $items = this.getSectionItems(currentTarget);
      if ($items.length > 1) {
        const $item = $(target).closest('.js-section__item_control');
        if ($item.length) {
          $item.remove();
          Example.updateHandles(currentTarget);
          this.updateProps();
        }
      }
    }
  }

  @bind
  private processingSection(_: number, element: HTMLElement): void {
    $('.js-input', element).each(this.processingInput);
  }

  @bind
  private processingInput(_: number, element: HTMLElement): void {
    const { property, type } = ($(element).data()?.data || {}) as {
      property?: string | undefined;
      type?: keyof Props;
    };
    const value = Example.prepareValue(element, property);
    this.prepareProp(value, type, property);
  }

  private prepareProp(
    value?: unknown,
    type?: KeyProps,
    property?: string
  ): undefined {
    if (!type || !property) {
      return;
    }
    if (property === 'values') {
      if (type === 'values' && !isUndefined(value)) {
        this.props = {
          ...this.props,
          values: [...(this.props?.values || []), value as number],
        };
      } else if (type === 'mark' && !isUndefined(value)) {
        this.props = {
          ...this.props,
          mark: {
            ...(this.props?.mark || {}),
            values: [...(this.props?.mark?.values || []), value as number],
          },
        };
      }
    } else if (
      [
        'min',
        'max',
        'step',
        'disabled',
        'vertical',
        'reverse',
        'precision',
        'indent',
        'isFocused',
      ].indexOf(property) !== -1
    ) {
      this.props = {
        ...this.props,
        [property]: value,
      };
    } else {
      this.props = {
        ...this.props,
        [type]: {
          ...((this.props || {})[type] as { key: keyof Props }),
          [property]: value,
        },
      };
    }
  }

  private static prepareValue(
    element?: HTMLElement,
    property?: string
  ): unknown {
    let value;
    if (!(element instanceof HTMLElement) || !trim(property)) {
      return undefined;
    }
    const $input = $('input', element);
    value = $input.val();
    if (isUndefined(value)) {
      return undefined;
    }
    switch (property) {
      case 'values':
      case 'min':
      case 'max':
      case 'step':
      case 'precision':
      case 'indent': {
        if (
          Number.isNaN(Number(value)) ||
          Number.isNaN(parseFloat(String(value)))
        ) {
          return undefined;
        }
        return parseFloat(String(value));
      }
      case 'disabled':
      case 'vertical':
      case 'reverse':
      case 'isFocused':
      case 'on':
      case 'dot':
      case 'always': {
        value = Boolean($input.prop('checked') as string);
        return value;
      }
      case 'classNames':
      case 'styles': {
        return Example.prepareArray(value);
      }
      case 'className':
      case 'wrapClassName': {
        if (!isString(value) || !trim(value)) {
          return undefined;
        }
        return trim(value);
      }
      case 'style': {
        return Example.prepareObject(value);
      }
      case 'render': {
        return Example.prepareFunction(value);
      }
      default: {
        return undefined;
      }
    }
  }
}

export default Example;
