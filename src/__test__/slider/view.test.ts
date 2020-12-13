import View from "../../slider/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
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
      let $slider = $(".slider", $parent);
      expect($slider.length).toBe(0);

      view.setProps(defaultProps);
      view.render($parent);
      $slider = $(".slider", $parent);
      expect($slider.length).toBe(1);
    });

    test("render view check count handle", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper1"/>');
      const view = new View();
      const $parent = $(".slider__wrapper1");
      view.setProps(defaultProps);
      view.render($parent);
      let $handle = $(".slider__handle", $parent);
      expect($handle.length).toBe(1);

      view.setProps({ ...defaultProps, values: [20, 80] });
      $handle = $(".slider__handle", $parent);
      expect($handle.length).toBe(2);

      view.setProps({ ...defaultProps, values: [20, 80, 50] });
      $handle = $(".slider__handle", $parent);
      expect($handle.length).toBe(3);

      view.setProps({ ...defaultProps, values: [20] });
      $handle = $(".slider__handle", $parent);
      expect($handle.length).toBe(1);
    });

    test("render view check count track", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper2"/>');
      const view = new View();
      const $parent = $(".slider__wrapper2");
      view.setProps(defaultProps);
      view.render($parent);
      let $tracks = $(".slider__track", $parent);
      expect($tracks.length).toBe(1);

      let values: number[] = [20, 80];
      view.setProps({ ...defaultProps, values });
      $tracks = $(".slider__track", $parent);

      expect($tracks.length).toBe(
        values.length > 1 ? values.length - 1 : values.length
      );
      values = [20, 80, 50];
      view.setProps({ ...defaultProps, values });
      $tracks = $(".slider__track", $parent);

      expect($tracks.length).toBe(
        values.length > 1 ? values.length - 1 : values.length
      );
      values = [20];
      view.setProps({ ...defaultProps, values });
      $tracks = $(".slider__track", $parent);

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
      let $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(0);

      view.setProps({ ...defaultProps, dot });
      $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(0);

      props = { ...defaultProps, dot, step: 10 };
      view.setProps(props);
      $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(11);

      props = { ...defaultProps, dot, step: 50 };
      view.setProps(props);
      $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(3);

      props = { ...defaultProps, dot, step: 50, mark: { on: true } };
      view.setProps(props);
      $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(3);

      props = {
        ...defaultProps,
        dot,
        step: 50,
        mark: { on: true, values: [20] },
      };
      view.setProps(props);
      $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(3);

      props = {
        ...defaultProps,
        dot,
        step: 50,
        mark: { on: true, values: [20], dot: true },
      };
      view.setProps(props);
      $dot = $(".slider__dot", $parent);
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
      let $mark = $(".slider__mark", $parent);
      expect($mark.length).toBe(0);

      view.setProps({ ...defaultProps, mark });
      $mark = $(".slider__mark", $parent);
      expect($mark.length).toBe(0);

      view.setProps({
        ...defaultProps,
        mark,
        step: 10,
      });
      $mark = $(".slider__mark", $parent);
      expect($mark.length).toBe(11);

      view.setProps({
        ...defaultProps,
        mark: { on: true, values: [15] },
        step: 20,
      });
      $mark = $(".slider__mark", $parent);
      expect($mark.length).toBe(7);
    });

    test("render view check count tooltip", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      const className = "slider__wrapper5";
      const findClassName = ".slider__tooltip";
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
      $mark = $(".slider__tooltip_always", $parent);
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
  });
});
