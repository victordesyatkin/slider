import $ from "jquery";

import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import View from "../../slider/view";
import { defaultProps } from "../../slider/index";
import { Dot, Mark, Tooltip, DefaultPropsView } from "../../types";

describe("slider", () => {
  describe("view", () => {
    test("create view", () => {
      const view = new View();
      expect(view).toBeInstanceOf(View);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper"/>');
      const view = new View();
      const $parent = $(".slider__wrapper");
      view.render($parent);
      let $slider = $(`.${defaultProps.prefixCls}`, $parent);
      expect($slider.length).toBe(0);

      view.setProps(defaultProps);
      $slider = $(`.${defaultProps.prefixCls}`, $parent);
      expect($slider.length).toBe(1);
    });

    test("render view check count handle", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper1"/>');
      const view = new View();
      const $parent = $(".slider__wrapper1");
      view.setProps(defaultProps);
      view.render($parent);
      let $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      expect($handle.length).toBe(1);

      view.setProps({ ...defaultProps, values: [20, 80] });
      $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      expect($handle.length).toBe(2);

      view.setProps({ ...defaultProps, values: [20, 80, 50] });
      $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      expect($handle.length).toBe(3);

      view.setProps({ ...defaultProps, values: [20] });
      $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      expect($handle.length).toBe(1);
    });

    test("render view check count track", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper2"/>');
      const view = new View();
      const $parent = $(".slider__wrapper2");
      view.setProps(defaultProps);
      view.render($parent);
      let $tracks = $(`.${defaultProps.prefixCls}__track`, $parent);
      expect($tracks.length).toBe(1);

      let values: number[] = [20, 80];
      view.setProps({ ...defaultProps, values });
      $tracks = $(`.${defaultProps.prefixCls}__track`, $parent);

      expect($tracks.length).toBe(
        values.length > 1 ? values.length - 1 : values.length
      );
      values = [20, 80, 50];
      view.setProps({ ...defaultProps, values });
      $tracks = $(`.${defaultProps.prefixCls}__track`, $parent);

      expect($tracks.length).toBe(
        values.length > 1 ? values.length - 1 : values.length
      );
      values = [20];
      view.setProps({ ...defaultProps, values });
      $tracks = $(`.${defaultProps.prefixCls}__track`, $parent);

      expect($tracks.length).toBe(
        values.length > 1 ? values.length - 1 : values.length
      );
    });

    test("render view check count dots", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper3"/>');
      const view = new View();
      const $parent = $(".slider__wrapper3");
      let dot: Dot = { on: true };
      let props = { ...defaultProps };
      view.setProps(props);
      view.render($parent);
      let $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(0);

      view.setProps({ ...defaultProps, dot });
      $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(0);

      props = { ...defaultProps, dot, step: 10 };
      view.setProps(props);
      $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(11);

      props = { ...defaultProps, dot, step: 50 };
      view.setProps(props);
      $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(3);

      props = { ...defaultProps, dot, step: 50, mark: { on: true } };
      view.setProps(props);
      $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(3);

      props = {
        ...defaultProps,
        dot,
        step: 50,
        mark: { on: true, values: [20] },
      };
      view.setProps(props);
      $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(3);

      props = {
        ...defaultProps,
        dot,
        step: 50,
        mark: { on: true, values: [20], dot: true },
      };
      view.setProps(props);
      $dot = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($dot.length).toBe(4);
    });

    test("render view check count marks", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper4"/>');
      const view = new View();
      const $parent = $(".slider__wrapper4");
      let mark: Mark = { on: true };
      view.setProps({ ...defaultProps });
      view.render($parent);
      let $mark = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($mark.length).toBe(0);

      view.setProps({ ...defaultProps, mark });
      $mark = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($mark.length).toBe(0);

      view.setProps({
        ...defaultProps,
        mark,
        step: 10,
      });
      $mark = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($mark.length).toBe(11);

      view.setProps({
        ...defaultProps,
        mark: { on: true, values: [15] },
        step: 20,
      });
      $mark = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($mark.length).toBe(7);
    });

    test("render view check count tooltip", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      const className = "slider__wrapper5";
      const findClassName = `.${defaultProps.prefixCls}__tooltip`;
      $("body").append(`<div class="${className}"/>`);
      const view = new View();
      const $parent = $(`.${className}`);
      let tooltip: Tooltip = { on: true };
      view.setProps({ ...defaultProps });
      view.render($parent);
      let $mark = $(findClassName, $parent);
      expect($mark.length).toBe(0);

      view.setProps({ ...defaultProps, tooltip });
      $mark = $(findClassName, $parent);
      expect($mark.length).toBe(1);

      view.setProps({ ...defaultProps, tooltip, values: [20, 40] });
      $mark = $(findClassName, $parent);
      expect($mark.length).toBe(2);

      view.setProps({ ...defaultProps, tooltip, values: [20, 40, 30] });
      $mark = $(findClassName, $parent);
      expect($mark.length).toBe(3);

      view.setProps({ ...defaultProps, tooltip, values: [20] });
      $mark = $(findClassName, $parent);
      expect($mark.length).toBe(1);

      view.setProps({
        ...defaultProps,
        tooltip: { ...tooltip, always: true },
        values: [20],
      });
      $mark = $(`.${defaultProps.prefixCls}__tooltip_always`, $parent);
      expect($mark.length).toBe(1);
    });

    test("view check subscribe, publish", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      const className = "slider__wrapper6";
      $("body").append(`<div class="${className}"/>`);
      const view = new View();
      const mockCallback = jest.fn((data: any): void => {});
      view.subscribe("setPropsModel", mockCallback);
      const $parent = $(`.${className}`);
      view.setProps({ ...defaultProps });
      view.render($parent);
      view.publish("setPropsModel", 5);
      expect(mockCallback.mock.calls.length).toBe(1);

      expect(mockCallback.mock.calls[0][0]).toBe(5);
    });

    test("handleViewClick", () => {
      setFunctionGetBoundingClientRectHTMLElement({ width: 100, height: 100 });
      $("body").append('<div class="slider__wrapper7"/>');
      const view = new View();
      const $parent = $(".slider__wrapper7");
      view.setProps(defaultProps);
      view.render($parent);
      let mockCallback = jest.fn(
        (options: {
          index: number;
          event: MouseEvent;
          value?: number;
          length: number;
          start: number;
        }): void => {}
      );
      view.subscribe("handleViewClick", mockCallback);
      let $rail = $(`.${defaultProps.prefixCls}__rail`, $parent);
      $rail.trigger("click");
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    test("handleViewMouseDown slider view", () => {
      setFunctionGetBoundingClientRectHTMLElement({ width: 100, height: 100 });
      $("body").append('<div class="slider__wrapper8"/>');
      const view = new View();
      const $parent = $(".slider__wrapper8");
      view.setProps({ ...defaultProps, dot: { on: true } });
      view.render($parent);
      let mockCallback = jest.fn((options: { index: number }): void => {});
      view.subscribe("handleViewMouseDown", mockCallback);
      const $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      $handle.trigger("mousedown");
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual({ index: 0 });
    });

    test("handleWindowMouseUp slider view", () => {
      setFunctionGetBoundingClientRectHTMLElement({
        width: 100,
        height: 100,
      });
      $("body").append('<div class="slider__wrapper9"/>');
      const $parent = $(".slider__wrapper9");
      const view = new View();
      view.render($parent);
      view.setProps(defaultProps);
      let mockCallback = jest.fn((): void => {});
      view.subscribe("handleWindowMouseUp", mockCallback);
      window.dispatchEvent(new Event("mouseup"));
      expect(mockCallback.mock.calls.length).toBe(0);
      const $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      $handle.trigger("mousedown");
      window.dispatchEvent(new Event("mouseup"));
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    test("handleWindowMouseMove slider view", () => {
      setFunctionGetBoundingClientRectHTMLElement({
        width: 100,
        height: 100,
      });
      $("body").append('<div class="slider__wrapper10"/>');
      const $parent = $(".slider__wrapper10");
      const view = new View();
      view.render($parent);
      view.setProps(defaultProps);
      let mockCallback = jest.fn(
        (options: {
          event: MouseEvent;
          start: number;
          length: number;
        }): void => {}
      );
      view.subscribe("handleWindowMouseMove", mockCallback);
      expect(mockCallback.mock.calls.length).toBe(0);
      const $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      $handle.trigger("mousedown");
      let event = new MouseEvent("mousemove");
      window.dispatchEvent(event);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual({
        event,
        start: 0,
        length: 100,
      });
    });
  });
});
