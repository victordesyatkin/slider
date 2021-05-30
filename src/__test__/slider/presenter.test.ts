import $ from 'jquery';

import { defaultProps, uniqId } from '../../helpers/utils';
import Presenter from '../../Presenter';

describe('slider', () => {
  describe('presenter', () => {
    test('new presenter', () => {
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const presenter = new Presenter($element);
      expect(presenter).toBeInstanceOf(Presenter);
    });

    test('initHandlesView, initHandlesModel, onBeforeChange', () => {
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const presenter = new Presenter($element, {
        ...defaultProps,
        values: [0, 50],
        isFocused: true,
      });
      let $handle = $(`.${defaultProps.prefixCls}__handle`, $element);
      $($handle.get(1)).trigger('mousedown');
      $($handle.get(1)).trigger('mouseup');
      let props = presenter.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          index: 1,
        })
      );
      expect($handle.length).toEqual(2);
      presenter.setProps({ ...defaultProps, values: [10] });
      $handle = $(`.${defaultProps.prefixCls}__handle`, $element);
      expect($handle.length).toEqual(1);
    });

    test('onAfterChange', () => {
      const onAfterChange = jest.fn((values: number[]): void => {});
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const props = {
        ...defaultProps,
        values: [10, 20],
        onAfterChange: onAfterChange,
      };
      const _ = new Presenter($element, props);
      const $handle = $(`.${defaultProps.prefixCls}__handle`, $element);
      $($handle.get(1)).trigger('mousedown');
      $($handle.get(1)).trigger('mouseup');
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([10, 20]);
    });

    test('onChange', () => {
      const onChange = jest.fn((value: number[]): void => {});
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const props = {
        ...defaultProps,
        onChange,
      };
      const _ = new Presenter($element, props);
      const $handle = $(`.${defaultProps.prefixCls}__handle`, $element);
      const event = $.Event('mousemove');
      event.pageX = 20;
      event.pageY = 100;
      $($handle.get(0)).trigger('mousedown');
      $($handle.get(0)).trigger(event);
      $($handle.get(0)).trigger('mouseup');
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([100]);
      expect(onChange.mock.calls.length).toBe(1);
    });

    test('getProps', () => {
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const presenter = new Presenter($element);
      expect(defaultProps).toStrictEqual(presenter.getProps());
    });

    test('setProps', () => {
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const presenter = new Presenter($element);
      const props = { ...defaultProps, values: [5] };
      presenter.setProps(props);
      expect(props).toStrictEqual(presenter.getProps());
    });

    test('setIndex', () => {
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $element = $(`.${className}`);
      const presenter = new Presenter($element, {
        ...defaultProps,
        values: [0, 50],
        isFocused: true,
      });
      let $handle = $(`.${defaultProps.prefixCls}__handle`, $element);
      $($handle.get(1)).trigger('mousedown');
      $($handle.get(1)).trigger('mouseup');
      let props = presenter.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          index: 1,
        })
      );
    });
  });
});
