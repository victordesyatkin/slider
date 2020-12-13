import MarkView from "../../components/mark/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { Rail, Dot, Mark, Tooltip } from "../../types";

describe("rail", () => {
  describe("view", () => {
    test("create mark", () => {
      const view = new MarkView({ index: 0 });
      expect(view).toBeInstanceOf(MarkView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render mark view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper"/>');
      const view = new MarkView({ index: 0 });
      const $parent = $(".slider__wrapper");
      view.render($parent);
      let $el = $(".slider__mark", $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      view.render($parent);
      $el = $(".slider__mark", $parent);
      expect($el.length).toBe(0);

      view.setAddition({ index: 0, value: 62 });
      view.setProps(defaultProps);
      view.render($parent);
      $el = $(".slider__mark", $parent);
      expect($el.length).toBe(1);
    });
  });
});
