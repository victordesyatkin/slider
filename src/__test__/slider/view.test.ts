import View from "../../slider/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";

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
  });
});
