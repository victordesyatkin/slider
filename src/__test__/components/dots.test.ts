import DotsView from "../../components/dots/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";

describe("rail", () => {
  describe("view", () => {
    test("create marks view", () => {
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

    test("render dots view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper-8"/>');
      const view = new DotsView({ index: 0 });
      const $parent = $(".slider__wrapper-8");
      view.render($parent);
      let $el = $(".slider__dots", $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(".slider__dots", $parent);
      expect($el.length).toBe(0);

      view.setProps({ ...defaultProps, dot: { on: true } });
      $el = $(".slider__dots", $parent);
      expect($el.length).toBe(0);

      $el = $(".slider__dot", $parent);
      expect($el.length).toBe(0);

      view.setProps({ ...defaultProps, dot: { on: true }, step: 10 });
      $el = $(".slider__dot", $parent);
      expect($el.length).toBe(11);

      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        mark: { on: true },
      });
      $el = $(".slider__dot", $parent);
      expect($el.length).toBe(11);

      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        mark: { on: true, values: [14, 86] },
      });
      $el = $(".slider__dot", $parent);
      expect($el.length).toBe(11);

      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        mark: { on: true, values: [14, 86], dot: true },
      });
      $el = $(".slider__dot", $parent);
      expect($el.length).toBe(13);
    });
  });
});
