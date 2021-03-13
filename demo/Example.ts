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
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
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
      return result.toString() === '[object Object]';
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

  private init(): void {
    this.slider = this.$sliderWrapper
      .slider({ onAfterChange: this.onAfterChange })
      .data(Slider.PLUGIN_NAME) as Slider;
    this.initHandlers();
    this.updateProps();
  }

  private initHandlers() {
    this.$sections.each(this.initHandler);
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
      this.slider.setProps(this.props);
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
    set(this.props, ['values'], values);
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
        $input.attr({ id: uniqId });
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
  private processingSection(index: number, element: HTMLElement): void {
    $('.js-input', element).each(this.processingInput);
  }

  @bind
  private processingInput(index: number, element: HTMLElement): void {
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
        'push',
        'precision',
        'indent',
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
      case 'push':
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
