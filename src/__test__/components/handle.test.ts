import $ from 'jquery';

import { defaultProps } from '../../helpers/utils';
import HandleView from '../../View/HandleView';

describe('handle', () => {
  test('handleViewMouseDown handle view', () => {
    let handleViewMouseDown1 = jest.fn(
      (index: number, event: any, value?: number): void => {}
    );
    let addition = {
      index: 0,
      handlers: { handleViewMouseDown: handleViewMouseDown1 },
    };
    const view = new HandleView(addition);
    let className = 'slider__wrapper-9';
    $('body').append(`<div class="${className}"/>`);
    const $parent = $(`.${className}`);
    view.setProps(defaultProps);
    view.render($parent);
    let $element = $(`.${defaultProps.prefixClassName}__handle`, $parent);
    $element.trigger('mousedown');
    expect(handleViewMouseDown1.mock.calls.length).toBe(0);

    let handleViewMouseDown2 = jest.fn(
      (index: number, event: any, value?: number): void => {}
    );
    view.setAddition({
      ...addition,
      handles: { handleViewMouseDown: handleViewMouseDown2 },
    });
    view.setProps(defaultProps);
    view.render($parent);
    $element = $(`.${defaultProps.prefixClassName}__handle`, $parent);
    expect($element.length).toBe(1);
    $element.trigger('mousedown');
    expect(handleViewMouseDown2.mock.calls.length).toBe(1);
  });

  test('isOn/isOff tooltip handle view', () => {
    let addition = { index: 0 };
    const view = new HandleView(addition);
    let className = 'slider__wrapper-10';
    $('body').append(`<div class="${className}"/>`);
    const $parent = $(`.${className}`);
    let props = { ...defaultProps, tooltip: { isOn: true } };
    view.setProps(props);
    view.render($parent);
    let $handle = $(`.${defaultProps.prefixClassName}__handle`, $parent);
    let $tooltip = $(`.${defaultProps.prefixClassName}__tooltip`, $parent);
    expect($handle.length).toBe(1);

    expect($tooltip.length).toBe(1);

    props = { ...defaultProps, tooltip: { isOn: false } };
    view.setProps(props);
    $handle = $(`.${defaultProps.prefixClassName}__handle`, $parent);
    expect($handle.length).toBe(1);
    $tooltip = $(`.${defaultProps.prefixClassName}__tooltip`, $parent);
    expect($tooltip.length).toBe(0);
  });
});
