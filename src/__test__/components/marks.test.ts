import $ from "jquery";

import MarksView from "../../components/marks/view";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";

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
      let $element = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($element.length).toBe(0);

      view.setProps({ ...defaultProps, mark: { on: true } });
      $element = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($element.length).toBe(1);

      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(0);

      view.setProps({ ...defaultProps, mark: { on: true }, step: 10 });
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(11);

      view.setProps({
        ...defaultProps,
        mark: { on: true, values: [24] },
        step: 10,
      });
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(12);
    });
    test("updateView marks", () => {
      const className = "slider__wrapper-10";
      $("body").append(`<div class="${className}"/>`);
      let addition = { index: 0 };
      const view = new MarksView(addition);
      const $parent = $(`.${className}`);
      let $element = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($element.length).toBe(0);
      let props = { ...defaultProps, mark: { on: true } };
      view.setProps(props);
      view.render($parent);
      $element = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($element.length).toBe(1);
      props = { ...defaultProps, mark: { on: false } };
      view.setProps(props);
      $element = $(`.${defaultProps.prefixCls}__marks`, $parent);
      expect($element.length).toBe(0);
    });
  });
});
