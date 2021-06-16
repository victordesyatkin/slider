import $ from 'jquery';

import DotsView from '../../View/DotsView';
import {
  setFunctionGetBoundingClientRectHTMLElement,
  defaultProps,
} from '../../helpers/utils';

describe('dots', () => {
  describe('view', () => {
    test('create dots view', () => {
      const view = new DotsView({ index: 0 });
      expect(view).toBeInstanceOf(DotsView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test('render dots view', () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $('body').append('<div class="slider__wrapper-8"/>');
      const view = new DotsView({ index: 0 });
      const $parent = $('.slider__wrapper-8');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dots`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixClassName}__dots`, $parent);
      expect($element.length).toBe(0);

      view.setProps({ ...defaultProps, dot: { isOn: true } });
      $element = $(`.${defaultProps.prefixClassName}__dots`, $parent);
      expect($element.length).toBe(1);

      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(0);

      view.setProps({ ...defaultProps, dot: { isOn: true }, step: 10 });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(11);

      view.setProps({
        ...defaultProps,
        dot: { isOn: true },
        step: 10,
        mark: { isOn: true },
      });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(11);

      view.setProps({
        ...defaultProps,
        dot: { isOn: true },
        step: 10,
        mark: { isOn: true, values: [14, 86] },
      });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(11);

      view.setProps({
        ...defaultProps,
        dot: { isOn: true },
        step: 10,
        mark: { isOn: true, values: [14, 86], withDot: true },
      });
      $element = $(`.${defaultProps.prefixClassName}__dot`, $parent);
      expect($element.length).toBe(13);
    });

    test('updateView dots view', () => {
      const className = 'slider__wrapper-9';
      $('body').append(`<div class="${className}"/>`);
      let addition = { index: 0 };
      const view = new DotsView(addition);
      const $parent = $(`.${className}`);
      let props = { ...defaultProps, dot: { isOn: true } };
      view.setProps(props);
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__dots`, $parent);
      expect($element.length).toBe(1);
      view.setProps({ ...props, dot: { isOn: false } });
      $element = $(`.${defaultProps.prefixClassName}__dots`, $parent);
      expect($element.length).toBe(0);
    });

    test('createView dots view', () => {
      const className = 'slider__wrapper-10';
      $('body').append(`<div class="${className}"/>`);
      let addition = { index: 0 };
      const view = new DotsView(addition);
      const $parent = $(`.${className}`);
      let $element = $(`.${defaultProps.prefixClassName}__dots`, $parent);
      expect($element.length).toBe(0);
    });
  });
});
