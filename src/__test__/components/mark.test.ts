import $ from "jquery";

import { defaultProps } from "../../slider/index";
import MarkView from "../../components/mark/view";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { DefaultProps, Addition } from "../../types";

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
      let $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      view.render($parent);
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(0);

      view.setAddition({ index: 0, value: 62 });
      view.setProps(defaultProps);
      view.render($parent);
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(1);
    });

    test("prepareStyle mark view", () => {
      let addition = { index: 0 };
      const mark = new MarkView(addition);
      let className = "slider__wrapper-0";
      $("body").append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      mark.render($parent);
      let $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.css("color")).toBeUndefined();
    });

    test("prepareContent mark view", () => {
      let addition = { index: 0, value: 80 };
      let mockCallback = jest.fn((value: number): string => {
        return `${value}%`;
      });
      let props: DefaultProps = {
        ...defaultProps,
        mark: { on: true },
      };
      const mark = new MarkView(addition);
      mark.setProps(props);
      let className = "slider__wrapper-1";
      $("body").append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      mark.render($parent);
      let $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(1);
      expect($element.text()).toBe(`${addition.value}`);
      props = { ...props, mark: { render: mockCallback, on: true } };
      mark.setProps(props);
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(1);
      expect($element.text()).toBe(`${addition.value}%`);

      props = { ...props, mark: { on: true } };
      mark.setProps(props);

      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      expect($element.length).toBe(1);
      expect($element.text()).toBe(`${addition.value}`);
    });

    test("handleViewClick mark view", () => {
      let handleViewClick = jest.fn((value: number): string => {
        return `${value}%`;
      });
      let addition: Addition = {
        index: 0,
        value: 80,
        handles: { handleViewClick },
      };
      let props: DefaultProps = {
        ...defaultProps,
      };
      const mark = new MarkView(addition);
      let className = "slider__wrapper-2";
      $("body").append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      mark.render($parent);
      let $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      $element.trigger("click");
      mark.setProps(props);
      expect(handleViewClick.mock.calls.length).toBe(0);

      addition = { index: 0, handles: { handleViewClick } };
      mark.setAddition(addition);
      mark.setProps(props);
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      $element.trigger("click");
      expect(handleViewClick.mock.calls.length).toBe(0);

      addition = { index: 0, value: 80, handles: { handleViewClick } };
      mark.setAddition(addition);
      mark.setProps(props);
      $element = $(`.${defaultProps.prefixCls}__mark`, $parent);
      $element.trigger("click");
      expect(handleViewClick.mock.calls.length).toBe(1);
    });

    test("getAddition mark view", () => {
      let addition: Addition = {
        index: 0,
        value: 80,
      };
      const mark = new MarkView(addition);
      expect(mark.getAddition()).toEqual(addition);
    });
  });
});
