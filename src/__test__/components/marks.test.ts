import $ from 'jquery';

import MarksView from '../../View/MarksView';
import {
  setFunctionGetBoundingClientRectHTMLElement,
  defaultProps,
} from '../../helpers/utils';

describe('rail', () => {
  describe('view', () => {
    test('create marks view', () => {
      const view = new MarksView({ index: 0 });
      expect(view).toBeInstanceOf(MarksView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test('render marks view', () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $('body').append('<div class="slider__wrapper7"/>');
      const view = new MarksView({ index: 0 });
      const $parent = $('.slider__wrapper7');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__marks`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixClassName}__marks`, $parent);
      expect($element.length).toBe(0);

      view.setProps({ ...defaultProps, mark: { isOn: true } });
      $element = $(`.${defaultProps.prefixClassName}__marks`, $parent);
      expect($element.length).toBe(1);

      $element = $(`.${defaultProps.prefixClassName}__mark`, $parent);
      expect($element.length).toBe(2);
      view.setProps({ ...defaultProps, mark: { isOn: true }, step: 10 });
      $element = $(`.${defaultProps.prefixClassName}__mark`, $parent);
      expect($element.length).toBe(11);

      view.setProps({
        ...defaultProps,
        mark: { isOn: true, values: [24] },
        step: 10,
      });
      $element = $(`.${defaultProps.prefixClassName}__mark`, $parent);
      expect($element.length).toBe(12);
    });
    test('updateView marks', () => {
      const className = 'slider__wrapper-10';
      $('body').append(`<div class="${className}"/>`);
      let addition = { index: 0 };
      const view = new MarksView(addition);
      const $parent = $(`.${className}`);
      let $element = $(`.${defaultProps.prefixClassName}__marks`, $parent);
      expect($element.length).toBe(0);
      let props = { ...defaultProps, mark: { isOn: true } };
      view.setProps(props);
      view.render($parent);
      $element = $(`.${defaultProps.prefixClassName}__marks`, $parent);
      expect($element.length).toBe(1);
      props = { ...defaultProps, mark: { isOn: false } };
      view.setProps(props);
      $element = $(`.${defaultProps.prefixClassName}__marks`, $parent);
      expect($element.length).toBe(0);
    });
  });
});
