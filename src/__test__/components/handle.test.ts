import $ from "jquery";
import { defaultProps } from "../../slider/index";
import HandleView from "../../components/handle/view";

describe("handle", () => {
  test("onMouseDown handle view", () => {
    let mockCallback1 = jest.fn(
      (index: number, e: any, value?: number): void => {}
    );
    let addition = { index: 0, handlers: { mousedown: mockCallback1 } };
    const view = new HandleView(addition);
    const event = new Event("click");
    view.onMouseDown(event);
    let className = "slider__wrapper-9";
    $("body").append(`<div class="${className}"/>`);
    const $parent = $(`.${className}`);
    expect(mockCallback1.mock.calls.length).toBe(1);
    let mockCallback2 = jest.fn(
      (index: number, e: any, value?: number): void => {}
    );
    view.setAddition({ ...addition, handlers: { mousedown: mockCallback2 } });
    view.setProps(defaultProps);
    view.render($parent);
    let $el = $(`.${defaultProps.prefixCls}__handle`, $parent);
    expect($el.length).toBe(1);
    $el.trigger("mousedown");
    expect(mockCallback2.mock.calls.length).toBe(1);
  });

  test("on/off tooltip handle view", () => {
    let addition = { index: 0 };
    const view = new HandleView(addition);
    let className = "slider__wrapper-10";
    $("body").append(`<div class="${className}"/>`);
    const $parent = $(`.${className}`);
    let props = { ...defaultProps, tooltip: { on: true } };
    view.setProps(props);
    view.render($parent);
    let $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
    let $tooltip = $(`.${defaultProps.prefixCls}__tooltip`, $parent);
    expect($handle.length).toBe(1);

    expect($tooltip.length).toBe(1);

    props = { ...defaultProps, tooltip: { on: false } };
    view.setProps(props);
    $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
    expect($handle.length).toBe(1);
    $tooltip = $(`.${defaultProps.prefixCls}__tooltip`, $parent);
    expect($tooltip.length).toBe(0);
  });
});