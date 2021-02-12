import $ from "jquery";

import RailView from "../../components/rail/view";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { DefaultProps, Addition } from "../../types";

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
      let $element = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($element.length).toBe(1);
    });

    test("updateView rail view", () => {
      let addition = { index: 0 };
      const view = new RailView(addition);
      const className = "slider__wrapper-11";
      $("body").append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      let props = { ...defaultProps };
      view.setAddition(addition);
      view.setProps(props);
      view.render($parent);
      let $element = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($element.length).toBe(1);
      props = { ...defaultProps, rail: { on: false } };
      view.setProps(props);
      $element = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($element.length).toBe(0);
    });

    test("handleViewClick rail view", () => {
      let className = "slider__wrapper-13";
      $("body").append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      let handleViewClick = jest.fn((value: number): string => {
        return `${value}%`;
      });
      let addition: Addition = {
        index: 0,
      };
      let props: DefaultProps = {
        ...defaultProps,
      };
      const view = new RailView(addition);
      view.render($parent);
      view.setProps(props);
      let $view = $(`.${defaultProps.prefixCls}__rail`, $parent);
      $view.trigger("click");
      expect(handleViewClick.mock.calls.length).toBe(0);
      addition = { index: 0, handles: { handleViewClick } };
      view.setAddition(addition);
      view.setProps(props);
      $view = $(`.${defaultProps.prefixCls}__rail`, $parent);
      $view.trigger("click");
      expect(handleViewClick.mock.calls.length).toBe(1);
    });
  });
});
