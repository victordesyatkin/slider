import * as utils from "../../helpers/utils";
import $ from "jquery";
import merge from "lodash/merge";
import { defaultProps } from "../../slider/index";

function setFunctionGetBoundingClientRectHTMLElement() {
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    const domRect: DOMRect = {
      width: parseFloat(this.style.width) || 0,
      height: parseFloat(this.style.height) || 0,
      top: parseFloat(this.style.marginTop) || 0,
      left: parseFloat(this.style.marginLeft) || 0,
      x: 0,
      y: 0,
      toJSON: () => {},
      bottom: parseFloat(this.style.marginLeft) || 0,
      right: parseFloat(this.style.marginLeft) || 0,
    };
    return domRect;
  };
}

describe("helpers", () => {
  describe("utils", () => {
    test('style: undefined -> objectToString -> "" ', () => {
      expect(utils.objectToString()).toBe("");
    });

    test('style: { width: "100%", height: "100%" } -> objectToString -> width: 100%;height: 100%;', () => {
      expect(utils.objectToString({ width: "100%", height: "100%" })).toBe(
        "width: 100%;height: 100%;"
      );
    });

    test("value, min, max, precision? = 0 -> calcOffset -> number", () => {
      expect(utils.calcOffset(5, 0, 100)).toBe(5);
      expect(utils.calcOffset(25, 0, 100)).toBe(25);
      expect(utils.calcOffset(-5, 0, 100)).toBe(0);
      expect(utils.calcOffset(-5, -100, 100)).toBe(48);
      expect(utils.calcOffset(0, -100, 100)).toBe(50);
    });

    test("vertical, HTMLElement -> getHandleCenterPosition -> number", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      document.body.innerHTML = `<div class="class1" style="width:100px;height:100px;">hohoho</div>`;
      let el = $(".class1").get(0);
      expect(utils.getHandleCenterPosition(false, el)).toBe(50);
      document.body.innerHTML = "";
      document.body.innerHTML = `<div class="class2" style="width:50px;height:200px;">j2j2j2</div>`;
      el = $(".class2").get(0);
      expect(utils.getHandleCenterPosition(true, el)).toBe(100);
    });
    test("val: number, { max, min }: { max: number; min: number } -> ensureValueInRange -> number", () => {
      expect(utils.ensureValueInRange(4, { min: -70, max: 30 })).toBe(4);
      expect(utils.ensureValueInRange(100, { min: -70, max: 30 })).toBe(30);
      expect(utils.ensureValueInRange(-200, { min: -70, max: 30 })).toBe(-70);
      expect(utils.ensureValueInRange(16, { min: 0, max: 4 })).toBe(4);
    });
    test("(vertical: boolean, e: MouseEvent): number -> getMousePosition -> number", () => {
      let e = new MouseEvent("mousemove", {
        screenX: 4,
        screenY: 16,
        clientY: 22,
      });
      expect(utils.getMousePosition(true, e)).toBe(22);
      e = new MouseEvent("click", {
        screenX: 4,
        screenY: 40,
        clientY: 22,
      });
      expect(utils.getMousePosition(false, e)).toBe(0);
    });
    test("(step: number): number -> getPrecision -> number", () => {
      expect(utils.getPrecision(1.2452)).toBe(4);
      expect(utils.getPrecision(5.25)).toBe(2);
      expect(utils.getPrecision(25)).toBe(0);
    });
    test("v: number, props: DefaultProps:number -> ensureValuePrecision -> number", () => {
      expect(utils.ensureValuePrecision(14, defaultProps)).toBe(14);
      expect(
        utils.ensureValuePrecision(14, merge({ ...defaultProps }, { step: 25 }))
      ).toBe(25);
      expect(
        utils.ensureValuePrecision(
          14,
          merge({ ...defaultProps }, { step: 25, mark: { values: [16] } })
        )
      ).toBe(16);
    });
    test("14, { step: undefined, min: 16, max: 100 }, props: DefaultProps -> getClosestPoint -> 16", () => {
      expect(
        utils.getClosestPoint(
          14,
          { step: undefined, min: 16, max: 100 },
          defaultProps
        )
      ).toBe(16);
    });
    test("20, { step: 25, min: 16, max: 100 }, DefaultProps -> getClosestPoint -> 16", () => {
      expect(
        utils.getClosestPoint(20, { step: 25, min: 16, max: 100 }, defaultProps)
      ).toBe(16);
    });
    test("38, { step: 25, min: 0, max: 100 }, DefaultProps -> getClosestPoint -> 30", () => {
      expect(
        utils.getClosestPoint(
          38,
          { step: 25, min: 0, max: 100 },
          merge({ ...defaultProps }, { mark: { values: [30] } })
        )
      ).toBe(30);
    });
    test("(props: DefaultProps): DefaultProps, props: DefaultProps -> prepareProps -> DefaultProps", () => {
      let input = merge({ ...defaultProps }, { values: [65, 35] });
      let output = merge({ ...defaultProps }, { values: [30, 65] });
      expect(utils.prepareProps(input)).toEqual(output);
      input = merge({ ...input }, { step: 25 });
      output = merge({ ...input }, { values: [25, 75] });
      expect(utils.prepareProps(input)).toEqual(output);
    });
  });
});
