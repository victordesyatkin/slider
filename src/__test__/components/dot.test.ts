import DotView from "../../components/dot/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { merge } from "lodash";

describe("rail", () => {
  describe("view", () => {
    test("create dot view", () => {
      const addition = { index: 0 };
      const view = new DotView(addition);
      expect(view).toBeInstanceOf(DotView);
      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render dot view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper"/>');
      const view = new DotView({ index: 0 });
      const $parent = $(".slider__wrapper");
      view.render($parent);
      let $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(0);

      view.setAddition({ index: 0, value: 8 });
      view.setProps(defaultProps);
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);

      view.setAddition({ index: 0, value: 8 });
      view.setProps({ ...defaultProps, values: [20] });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect(
        $el.hasClass(`.${defaultProps.prefixCls}__dot_active`)
      ).toBeFalsy();

      view.setAddition({ index: 0, value: 25 });
      view.setProps({ ...defaultProps, values: [20] });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect(
        $el.hasClass(`${defaultProps.prefixCls}__dot_active`)
      ).toBeTruthy();

      view.setAddition({ index: 0, value: 60 });
      view.setProps({ ...defaultProps, values: [20, 40] });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect($el.hasClass(`${defaultProps.prefixCls}__dot_active`)).toBeFalsy();

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, values: [20, 60] });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect(
        $el.hasClass(`${defaultProps.prefixCls}__dot_active`)
      ).toBeTruthy();

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: true, reverse: false });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect($el[0].style.bottom).toBe("40%");
      expect($el[0].style.top).toBe("");
      expect($el[0].style.transform).toBe("translateY(+50%)");

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: true, reverse: true });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect($el[0].style.top).toBe("40%");
      expect($el[0].style.bottom).toBe("");
      expect($el[0].style.transform).toBe("none");

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: false, reverse: true });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect($el[0].style.right).toBe("40%");
      expect($el[0].style.left).toBe("");
      expect($el[0].style.transform).toBe("translateX(+50%)");

      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, vertical: false, reverse: false });
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      expect($el[0].style.left).toBe("40%");
      expect($el[0].style.right).toBe("");
      expect($el[0].style.transform).toBe("translateX(-50%)");
    });

    test("view dot prepareClassName", () => {
      const view = new DotView({ index: 0, value: 70 });
      expect(view.prepareClassName()).toBe("");
      view.setAddition({ index: 0, value: 40 });
      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        values: [10, 80],
      });
      $("body").append('<div class="slider__wrapper12"/>');
      const $parent = $(".slider__wrapper12");
      view.render($parent);
      let $el = $(`.${defaultProps.prefixCls}__dot_active`, $parent);
      expect($el.length).toBe(1);

      expect(view.prepareClassName()).toBe(
        "fsd-slider__dot fsd-slider__dot_active"
      );

      view.setAddition({ index: 0, value: 0 });
      expect(view.prepareClassName()).toBe("fsd-slider__dot");

      view.setProps({
        ...defaultProps,
        dot: { on: true },
        step: 10,
        values: [10],
      });
      view.setAddition({ index: 0, value: 20 });
      expect(view.prepareClassName()).toBe(
        "fsd-slider__dot fsd-slider__dot_active"
      );

      view.setAddition({ index: 0, value: 0 });
      expect(view.prepareClassName()).toBe("fsd-slider__dot");
    });

    test("view dot prepareStyle", () => {
      const view = new DotView({ index: 0, value: 70 });
      expect(view.prepareStyle()).toBeUndefined();
    });

    test("view dot onClick", () => {
      const view = new DotView({ index: 0, value: 70 });
      const event = new Event("click");
      expect(view.onClick(event)).toBeUndefined();

      view.setProps(merge({}, { ...defaultProps }));
      expect(view.onClick(event)).toBeUndefined();
      const mockCallback = jest.fn(
        (index: number, e: any, value: number): void => {}
      );
      view.setAddition({
        ...view.getAddition(),
        handlers: { click: mockCallback },
      });
      expect(view.onClick(event)).toBeUndefined();
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toBe(0);
      expect(mockCallback.mock.calls[0][1]).toBe(event);
      expect(mockCallback.mock.calls[0][2]).toBe(70);
    });

    test("view dot remove", () => {
      $("body").append('<div class="slider__wrapper11"/>');
      const view = new DotView({ index: 0 });
      view.setAddition({ index: 0, value: 40 });
      view.setProps({ ...defaultProps, dot: { on: true }, step: 10 });
      const $parent = $(".slider__wrapper11");
      view.render($parent);
      let $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(1);
      view.remove();
      $el = $(`.${defaultProps.prefixCls}__dot`, $parent);
      expect($el.length).toBe(0);
    });
  });
});
