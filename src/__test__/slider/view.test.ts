import $ from "jquery";

import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import View from "../../slider/view";
import { defaultProps } from "../../slider/index";
import { Dot, Mark, Tooltip } from "../../types";

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

    test("onClick", () => {
      setFunctionGetBoundingClientRectHTMLElement({ width: 100, height: 100 });
      const view = new View();
      let index = 0;
      let event = new MouseEvent("click");
      let mockCallback1 = jest.fn((values?: number[]): void => {});
      let mockCallback2 = jest.fn((values?: number[]): void => {});
      view.subscribe("setPropsModel", mockCallback1);
      view.subscribe("onMouseUp", mockCallback2);
      view.onClick(index, event);
      expect(mockCallback1.mock.calls.length).toBe(0);
      expect(mockCallback2.mock.calls.length).toBe(0);
      let props = { ...defaultProps, disabled: true };
      view.setProps(props);
      view.onClick(index, event);
      expect(mockCallback1.mock.calls.length).toBe(0);
      expect(mockCallback2.mock.calls.length).toBe(0);
      props = { ...defaultProps, disabled: false, vertical: true };
      view.setProps(props);
      event = new MouseEvent("click", {
        clientY: 50,
      });
      view.onClick(index, event);
      expect(mockCallback1.mock.calls.length).toBe(1);
      expect(mockCallback2.mock.calls.length).toBe(1);
      expect(mockCallback1.mock.calls[0][0]).toStrictEqual([50]);
      expect(mockCallback2.mock.calls[0][0]).toStrictEqual([50]);
      props = {
        ...defaultProps,
        disabled: false,
        vertical: true,
        values: [40, 65],
      };
      view.setProps(props);
      event = new MouseEvent("click", {
        clientY: 50,
      });
      view.currentHandleIndex = 0;
      view.onClick(index, event);
      expect(mockCallback1.mock.calls.length).toBe(2);
      expect(mockCallback2.mock.calls.length).toBe(2);
      expect(mockCallback1.mock.calls[1][0]).toStrictEqual([50, 65]);
      expect(mockCallback2.mock.calls[1][0]).toStrictEqual([50, 65]);
      view.onClick(index, event, 45);
      expect(mockCallback1.mock.calls.length).toBe(3);
      expect(mockCallback2.mock.calls.length).toBe(3);
      expect(mockCallback1.mock.calls[2][0]).toStrictEqual([45, 65]);
      expect(mockCallback2.mock.calls[2][0]).toStrictEqual([45, 65]);

      props = {
        ...defaultProps,
        disabled: false,
        vertical: true,
        values: [30],
      };
      view.setProps(props);
      view.onClick(index, event, 45);
      expect(mockCallback1.mock.calls.length).toBe(4);
      expect(mockCallback2.mock.calls.length).toBe(4);
      expect(mockCallback1.mock.calls[3][0]).toStrictEqual([45]);
      expect(mockCallback2.mock.calls[3][0]).toStrictEqual([45]);

      props = {
        ...defaultProps,
        disabled: false,
        vertical: true,
        values: [30, 72],
      };
      view.currentHandleIndex = undefined;
      view.setProps(props);
      view.onClick(index, event, 45);
      expect(mockCallback1.mock.calls.length).toBe(4);
      expect(mockCallback2.mock.calls.length).toBe(4);
    });

    test("onMouseDown slider view", () => {
      let mockCallback = jest.fn((values?: number[]): void => {});
      const view = new View();
      let props = { ...defaultProps };
      view.subscribe("onMouseDown", mockCallback);
      view.setProps(props);

      let index = 0;
      let event = new MouseEvent("click");
      view.onMouseDown(index, event);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([0]);

      props = { ...defaultProps, disabled: true };
      view.setProps(props);
      view.onMouseDown(index, event);
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    test("onMouseUp slider view", () => {
      let mockCallback = jest.fn((values?: number[]): void => {});
      const view = new View();
      let props = { ...defaultProps };
      view.subscribe("onMouseUp", mockCallback);
      view.setProps(props);

      let event = new MouseEvent("click");
      view.onMouseUp(event);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([0]);

      props = { ...defaultProps, disabled: true };
      view.setProps(props);
      view.onMouseUp(event);
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    test("onMouseMove slider view", () => {
      let mockCallback = jest.fn((values?: number[]): void => {});
      const view = new View();
      let props = { ...defaultProps };
      view.subscribe("setPropsModel", mockCallback);
      let event = new MouseEvent("click");
      view.onMouseMove(event);
      expect(mockCallback.mock.calls.length).toBe(0);

      view.setProps(props);
      view.onMouseMove(event);
      expect(mockCallback.mock.calls.length).toBe(0);

      setFunctionGetBoundingClientRectHTMLElement({ width: 100, height: 100 });
      view.currentHandleIndex = 0;
      props = { ...props, vertical: true };
      view.setProps(props);
      event = new MouseEvent("mousemove", {
        clientY: 30,
      });
      view.onMouseMove(event);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([70]);
      props = { ...props, values: [70] };
      view.setProps(props);
      view.onMouseMove(event);
      expect(mockCallback.mock.calls.length).toBe(1);
    });
  });
});
