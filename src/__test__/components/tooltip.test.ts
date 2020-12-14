import TooltipView from "../../components/tooltip/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { Rail, Dot, Mark, Tooltip } from "../../types";

describe("rail", () => {
  describe("view", () => {
    test("create tooltip view", () => {
      const addition = { index: 0 };
      const view = new TooltipView(addition);
      expect(view).toBeInstanceOf(TooltipView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render tooltip view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper"/>');
      const view = new TooltipView({ index: 0 });
      const $parent = $(".slider__wrapper");
      view.render($parent);
      let $el = $(`.${defaultProps.prefixCls}__tooltip`, $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__tooltip`, $parent);
      expect($el.length).toBe(0);

      view.setAddition({ index: 0, value: 47 });
      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__tooltip`, $parent);
      expect($el.length).toBe(1);
    });
  });
});
