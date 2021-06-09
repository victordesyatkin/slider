import $ from 'jquery';
import merge from 'lodash.merge';

import DotView from '../../View/DotsView/DotView';
import {
  setFunctionGetBoundingClientRectHTMLElement,
  defaultProps,
} from '../../helpers/utils';

describe('rail', () => {
  describe('view', () => {
    test('create dot view', () => {
      const addition = { index: 0 };
      const view = new DotView(addition);
      expect(view).toBeInstanceOf(DotView);
      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test('render dot view', () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $('body').append('<div class="slider__wrapper"/>');
      const view = new DotView({ index: 0 });
      const $parent = $('.slider__wrapper');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(0);

      view.setAddition({ index: 0, value: 8 });
      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);

      view.setAddition({ index: 0, value: 8 });
      view.setProps({ ...defaultProps, values: [20] });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect(
        $element.hasClass(`.${defaultProps.prefixClassName}__dot_active`)
      ).toBeFalsy();

      view.setAddition({ index: 0, value: 25 });
      view.setProps({ ...defaultProps, values: [20] });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect(
        $element.hasClass(`${defaultProps.prefixClassName}__dot_active`)
      ).toBeFalsy();

      view.setAddition({ index: 0, value: 60 });
      view.setProps({ ...defaultProps, values: [20, 40] });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect(
        $element.hasClass(`${defaultProps.prefixClassName}__dot_active`)
      ).toBeFalsy();

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, values: [20, 60] });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect(
        $element.hasClass(`${defaultProps.prefixClassName}__dot_active`)
      ).toBeTruthy();

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: true, reverse: false });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect($element[0].style.bottom).toBe('40%');
      expect($element[0].style.top).toBe('');
      expect($element[0].style.transform).toBe('translateY(+50%)');

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: true, reverse: true });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect($element[0].style.top).toBe('40%');
      expect($element[0].style.bottom).toBe('');
      expect($element[0].style.transform).toBe('none');

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: false, reverse: true });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect($element[0].style.right).toBe('40%');
      expect($element[0].style.left).toBe('');
      expect($element[0].style.transform).toBe('translateX(+50%)');

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: false, reverse: false });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      expect($element[0].style.left).toBe('40%');
      expect($element[0].style.right).toBe('');
      expect($element[0].style.transform).toBe('translateX(-50%)');
    });

    test('view dot prepareClassName', () => {
      const view = new DotView({ index: 0, value: 70 });
      let addition = { index: 0, value: 40 };
      view.setAddition(addition);
      let props = {
        ...defaultProps,
        dot: { on: true },
        step: 10,
        values: [10, 80],
      };
      view.setProps(props);
      $('body').append('<div class="slider__wrapper12"/>');
      const $parent = $('.slider__wrapper12');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dot_active`, $parent);
      expect($element.length).toBe(1);

      expect(props.values.length).toBeGreaterThan(1);
      expect(addition.value).toBeGreaterThanOrEqual(props.values[0]);
      expect(addition.value).toBeLessThanOrEqual(props.values[1]);
      expect($element.length).toBe(1);

      expect($element.attr('class')).toBe(
        'fsd-slider__dot fsd-slider__dot_active'
      );
      props = { ...props, values: [20] };
      view.setProps(props);
      expect(props.values.length).toBe(1);
      expect(addition.value).toBeGreaterThanOrEqual(props.values[0]);
      $element = $(`.${defaultProps.prefixClassName}__dot_active`, $parent);
      expect($element.length).toBe(0);
      expect($element.attr('class')).toBe(undefined);

      view.setAddition({ index: 0, value: 0 });
      view.setProps(props);
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.attr('class')).toBe(
        'fsd-slider__dot fsd-slider__dot_active'
      );

      view.setAddition({ index: 0, value: 20 });
      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        values: [10],
      });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.attr('class')).toBe('fsd-slider__dot');

      view.setAddition({ index: 0, value: 0 });
      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        values: [10],
      });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.attr('class')).toBe(
        'fsd-slider__dot fsd-slider__dot_active'
      );
    });

    test('view dot prepareStyle', () => {
      const view = new DotView({ index: 0, value: 70 });
      $('body').append('<div class="slider__wrapper121"/>');
      const $parent = $('.slider__wrapper121');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.css('color')).toBeUndefined();
    });

    test('view dot handleViewClick', () => {
      const view = new DotView({ index: 0, value: 70 });
      $('body').append('<div class="slider__wrapper122"/>');
      const $parent = $('.slider__wrapper122');
      view.render($parent);
      const handleViewClick = jest.fn(
        (index: number, event: JQuery.Event, value?: number): void => {}
      );
      let $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      $element.trigger('click');
      expect(handleViewClick.mock.calls.length).toBe(0);

      view.setProps($.extend({}, defaultProps));
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      $element.trigger('click');
      expect(handleViewClick.mock.calls.length).toBe(0);

      view.setAddition({
        ...view.getAddition(),
        handles: { handleViewClick },
      });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      $element.trigger('click');
      expect(handleViewClick.mock.calls.length).toBe(1);
      expect(handleViewClick.mock.calls[0][0]).toBe(0);
      expect(handleViewClick.mock.calls[0][2]).toBe(70);
    });

    test('view dot remove', () => {
      $('body').append('<div class="slider__wrapper11"/>');
      const view = new DotView({ index: 0 });
      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, dot: { on: true }, step: 10 });
      const $parent = $('.slider__wrapper11');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      view.remove();
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(0);
    });

    test('view dot initHandlers', () => {
      const handleViewClick = jest.fn(
        (index: number, e: any, value?: number): void => {}
      );
      const addition = {
        index: 0,
        value: 40,
        handles: { handleViewClick },
      };
      const view = new DotView(addition);
      view.setProps(defaultProps);
      $('body').append('<div class="slider__wrapper13"/>');
      const $parent = $('.slider__wrapper13');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(1);
      $element.trigger('click');
      expect(handleViewClick.mock.calls.length).toBe(1);
    });
  });
});
