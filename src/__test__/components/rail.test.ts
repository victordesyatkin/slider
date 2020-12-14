import RailView from "../../components/rail/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { Rail, Dot, Mark, Tooltip } from "../../types";

describe("rail", () => {
  describe("view", () => {
    test("create rail view", () => {
      const addition = { index: 0 };
      const view = new RailView(addition);
      expect(view).toBeInstanceOf(RailView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render rail view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper"/>');
      const addition = { index: 0 };
      const view = new RailView(addition);
      const $parent = $(".slider__wrapper");
      view.render($parent);
      let $el = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($el.length).toBe(1);
    });
  });
});
