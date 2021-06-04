import $ from 'jquery';

import Slider from '../../Slider';
import { uniqId, defaultProps } from '../../helpers/utils';

describe('slider', () => {
  describe('Slider.createSlider', () => {
    test('1 id -> Slider.createSlider -> 1 slider ', () => {
      $('body').append('<div id="slider__wrapper"></div>');
      const $el = $('#slider__wrapper');
      expect(Slider.createSlider($el)).toHaveLength(1);
    });
    test('5 div.class -> Slider.createSlider -> 5 slider', () => {
      $('body').append(
        '<div class="slider__wrapper"/><div class="slider__wrapper"/><div class="slider__wrapper"/><div class="slider__wrapper"/><div class="slider__wrapper"/>'
      );
      const $el = $('.slider__wrapper');
      expect(Slider.createSlider($el)).toHaveLength(5);
    });
    test('1 id -> Slider.createSlider -> access instance of plugin', () => {
      $('body').append('<div class="slider__wrapper"/>');
      const $el = $('.slider__wrapper');
      const slider = Slider.createSlider($el).data(Slider.PLUGIN_NAME);
      expect(slider).toBeInstanceOf(Slider);
      expect(slider).toEqual(
        expect.objectContaining({
          getProps: expect.any(Function),
          setProps: expect.any(Function),
          pickProps: expect.any(Function),
        })
      );
    });
    test('{values: [50, 80]} -> slider getProps ->  {values: [50,80]}', () => {
      $('body').append('<div id="slider__wrapper"/>');
      const $el = $('.slider__wrapper');
      const slider = Slider.createSlider($el, { values: [50, 80] }).data(
        Slider.PLUGIN_NAME
      );
      expect(slider).toBeInstanceOf(Slider);
      expect(slider.getProps()).toEqual(
        expect.objectContaining({
          values: expect.arrayContaining([50, 80]),
        })
      );
    });
    test('{ values: [50, 80], step: 25, min: 50 } -> slider setProps ->  { values: [50, 80], step: 25, min: 50 }', () => {
      $('body').append('<div class="slider__wrapper"/>');
      const $el = $('.slider__wrapper');
      const slider = Slider.createSlider($el).data(Slider.PLUGIN_NAME);
      slider.setProps({ values: [20, 80], step: 25, min: 10 });
      const props = slider.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          min: expect.any(Number),
          values: expect.arrayContaining([10, 85]),
          step: expect.any(Number),
        })
      );
      expect(props.min).toBe(10);
      expect(props.step).toBe(25);
    });
    test('{ values: [50, 80], step: 25, min: 50 } -> slider pickProps ->  {min: 50}', () => {
      $('body').append('<div class="slider__wrapper"/>');
      const $el = $('.slider__wrapper');
      const slider = Slider.createSlider($el, {
        values: [50, 80],
        step: 25,
        min: 50,
      }).data(Slider.PLUGIN_NAME);
      expect(slider).toBeInstanceOf(Slider);
      const pick = slider.pickProps(['min']);
      expect(pick).toEqual(
        expect.objectContaining({
          min: expect.any(Number),
        })
      );
      expect(pick.min).toBe(50);
    });
    test('onChange, onBeforeChange, onAfterChange null (noop)', () => {
      const onChange = jest.fn((_: number[]): void => {});
      const onBeforeChange = jest.fn((_: number[]): void => {});
      const onAfterChange = jest.fn((_: number[]): void => {});
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const slider = Slider.createSlider($element, {
        onChange,
        onBeforeChange,
        onAfterChange,
      }).data(Slider.PLUGIN_NAME);
      const $handle = $(`.${defaultProps.prefixClassName}__handle`, $element);
      const event = $.Event('mousemove');
      event.pageX = 20;
      event.pageY = 100;
      $($handle.get(0)).trigger('mousedown');
      $($handle.get(0)).trigger(event);
      $($handle.get(0)).trigger('mouseup');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onAfterChange.mock.calls.length).toBe(1);
      slider.setProps({
        ...defaultProps,
        onChange: null,
        onBeforeChange: null,
        onAfterChange: null,
      });
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onAfterChange.mock.calls.length).toBe(1);
    });
    test('unsubscribe onChange, onBeforeChange, onAfterChange', () => {
      const onChange = jest.fn((_: number[]): void => {});
      const onBeforeChange = jest.fn((_: number[]): void => {});
      const onAfterChange = jest.fn((_: number[]): void => {});
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const slider = Slider.createSlider($element, {
        onChange,
        onBeforeChange,
        onAfterChange,
      }).data(Slider.PLUGIN_NAME);
      const $handle = $(`.${defaultProps.prefixClassName}__handle`, $element);
      const event = $.Event('mousemove');
      event.pageX = 20;
      event.pageY = 100;
      $($handle.get(0)).trigger('mousedown');
      $($handle.get(0)).trigger(event);
      $($handle.get(0)).trigger('mouseup');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onAfterChange.mock.calls.length).toBe(1);
      slider.unsubscribe('onChange');
      slider.unsubscribe('onBeforeChange');
      slider.unsubscribe('onAfterChange');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onAfterChange.mock.calls.length).toBe(1);
    });
    test('unsubscribeAll onChange, onBeforeChange, onAfterChange', () => {
      const onChange = jest.fn((_: number[]): void => {});
      const onBeforeChange = jest.fn((_: number[]): void => {});
      const onAfterChange = jest.fn((_: number[]): void => {});
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const slider = Slider.createSlider($element, {
        onChange,
        onBeforeChange,
        onAfterChange,
      }).data(Slider.PLUGIN_NAME);
      const $handle = $(`.${defaultProps.prefixClassName}__handle`, $element);
      const event = $.Event('mousemove');
      event.pageX = 20;
      event.pageY = 100;
      $($handle.get(0)).trigger('mousedown');
      $($handle.get(0)).trigger(event);
      $($handle.get(0)).trigger('mouseup');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onAfterChange.mock.calls.length).toBe(1);
      slider.unsubscribeAll();
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onAfterChange.mock.calls.length).toBe(1);
    });
  });
});
