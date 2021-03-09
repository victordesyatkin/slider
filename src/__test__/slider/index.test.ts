import $ from 'jquery';

import { createSlider, Slider } from '../../slider/index';

describe('slider', () => {
  describe('createSlider', () => {
    test('1 id -> createSlider -> 1 slider ', () => {
      $('body').append('<div id="slider__wrapper"></div>');
      const $el = $('#slider__wrapper');
      expect(createSlider($el)).toHaveLength(1);
    });
    test('5 div.class -> createSlider -> 5 slider', () => {
      $('body').append(
        '<div class="slider__wrapper"/><div class="slider__wrapper"/><div class="slider__wrapper"/><div class="slider__wrapper"/><div class="slider__wrapper"/>'
      );
      const $el = $('.slider__wrapper');
      expect(createSlider($el)).toHaveLength(5);
    });
    test('1 id -> createSlider -> access instance of plugin', () => {
      $('body').append('<div class="slider__wrapper"/>');
      const $el = $('.slider__wrapper');
      const slider = createSlider($el).data(Slider.PLUGIN_NAME);
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
      const slider = createSlider($el, { values: [50, 80] }).data(
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
      const slider = createSlider($el).data(Slider.PLUGIN_NAME);
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
      const slider = createSlider($el, {
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
  });
});
