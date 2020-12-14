import MarksView from "../../components/marks/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { Rail, Dot, Mark, Tooltip } from "../../types";

describe("rail", () => {
  describe("view", () => {
    test("create marks view", () => {
      const view = new MarksView({ index: 0 });
      expect(view).toBeInstanceOf(MarksView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render marks view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper7"/>');
      const view = new MarksView({ index: 0 });
      const $parent = $(".slider__wrapper7");
      view.render($parent);
      let $el = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($el.length).toBe(0);

      view.setProps({ ...defaultProps, mark: { on: true } });
      $el = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($el.length).toBe(1);

      $el = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($el.length).toBe(0);

      view.setProps({ ...defaultProps, mark: { on: true }, step: 10 });
      $el = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($el.length).toBe(11);

      view.setProps({
        ...defaultProps,
        mark: { on: true, values: [24] },
        step: 10,
      });
      $el = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($el.length).toBe(12);
    });
  });
});
