import RailView from "../../components/rail/view";
import $ from "jquery";
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
      let $el = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($el.length).toBe(1);
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
      let $el = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($el.length).toBe(1);
      props = { ...defaultProps, rail: { on: false } };
      view.setProps(props);
      $el = $(`.${defaultProps.prefixCls}__rail`, $parent);
      expect($el.length).toBe(0);
    });

    test("onClick rail view", () => {
      let className = "slider__wrapper-13";
      let mockCallback = jest.fn((value: number): string => {
        return `${value}%`;
      });
      let addition: Addition = {
        index: 0,
      };
      let props: DefaultProps = {
        ...defaultProps,
      };
      const view = new RailView(addition);
      let event = new Event("click");
      view.onClick(event);
      view.setProps(props);
      view.onClick(event);
      expect(mockCallback.mock.calls.length).toBe(0);
      addition = { index: 0, handlers: { click: mockCallback } };
      view.setAddition(addition);
      view.setProps(props);
      view.onClick(event);
      expect(mockCallback.mock.calls.length).toBe(1);
    });
  });
});
