import $ from "jquery";
import merge from "lodash/merge";

import * as utils from "../../helpers/utils";
import { defaultProps } from "../../slider/index";

const className1 = "class1";
const className2 = "class2";

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
      utils.setFunctionGetBoundingClientRectHTMLElement();
      document.body.innerHTML = `<div class="${className1}" style="width:100px;height:100px;">hello world!</div>`;
      let el = $(`.${className1}`).get(0);
      expect(utils.getHandleCenterPosition(false, el)).toBe(50);
      document.body.innerHTML = "";
      document.body.innerHTML = `<div class="${className2}" style="width:50px;height:200px;">hello world!</div>`;
      el = $(`.${className2}`).get(0);
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
    test("v: number, props: tDefaultProps:number -> ensureValuePrecision -> number", () => {
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
    test("14, { step: undefined, min: 16, max: 100 }, props: tDefaultProps -> getClosestPoint -> 16", () => {
      expect(
        utils.getClosestPoint(
          14,
          { step: undefined, min: 16, max: 100 },
          defaultProps
        )
      ).toBe(16);
    });
    test("20, { step: 25, min: 16, max: 100 }, tDefaultProps -> getClosestPoint -> 16", () => {
      expect(
        utils.getClosestPoint(20, { step: 25, min: 16, max: 100 }, defaultProps)
      ).toBe(16);
    });
    test("38, { step: 25, min: 0, max: 100 }, tDefaultProps -> getClosestPoint -> 30", () => {
      expect(
        utils.getClosestPoint(
          38,
          { step: 25, min: 0, max: 100 },
          merge({ ...defaultProps }, { mark: { values: [30] } })
        )
      ).toBe(30);
    });
    test("(props: tDefaultProps): tDefaultProps, props: tDefaultProps -> prepareProps -> tDefaultProps", () => {
      let input = merge({ ...defaultProps }, { values: [65, 35] });
      let output = merge({ ...defaultProps }, { values: [30, 65] });
      expect(utils.prepareProps(input)).toEqual(output);
      input = merge({ ...input }, { step: 25 });
      output = merge({ ...input }, { values: [25, 75] });
      expect(utils.prepareProps(input)).toEqual(output);
    });
    test("undefined -> getCount -> 0", () => {
      expect(utils.getCount()).toBe(0);
    });
    test("values: [10, 48, 14] -> getCount -> 3", () => {
      expect(utils.getCount({ ...defaultProps, values: [10, 48, 14] })).toBe(3);
    });
    test("getSliderStart", () => {
      expect(utils.getSliderStart()).toBe(0);
      expect(utils.getSliderStart({ ...defaultProps })).toBe(0);
      document.body.innerHTML = `<div class="${className1}" style="width:100px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        height: 100,
        width: 100,
      });
      expect(utils.getSliderStart({ ...defaultProps }, $el)).toBe(0);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        marginTop: 10,
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({ ...defaultProps, vertical: true }, $el)
      ).toBe(10);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        marginBottom: 40,
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart(
          { ...defaultProps, vertical: true, reverse: true },
          $el
        )
      ).toBe(40);
    });
    test("getSliderLength", () => {
      utils.setFunctionGetBoundingClientRectHTMLElement({
        width: 200,
        height: 100,
      });
      document.body.innerHTML = `<div class="${className1}" style="width:200px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      expect(
        utils.getSliderLength({ view: $el, props: { ...defaultProps } })
      ).toBe(200);
      expect(
        utils.getSliderLength({
          view: $el,
          props: { ...defaultProps, vertical: true },
        })
      ).toBe(100);
    });

    test("calcValue", () => {
      utils.setFunctionGetBoundingClientRectHTMLElement({
        width: 200,
        height: 100,
      });
      document.body.innerHTML = `<div class="${className1}" style="width:200px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      expect(
        utils.calcValue({
          offset: 50,
          view: $el,
          props: { ...defaultProps },
          index: 0,
        })
      ).toBe(25);
      expect(
        utils.calcValue({
          offset: 50,
          view: $el,
          props: { ...defaultProps, vertical: true },
          index: 0,
        })
      ).toBe(50);
    });
    test("calcValueByPos", () => {
      utils.setFunctionGetBoundingClientRectHTMLElement({
        width: 200,
        height: 100,
      });
      document.body.innerHTML = `<div class="${className1}" style="width:200px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      expect(
        utils.calcValueByPos({
          position: 50,
          view: $el,
          props: { ...defaultProps },
          index: 0,
        })
      ).toBe(25);
      expect(
        utils.calcValueByPos({
          position: 50,
          view: $el,
          props: { ...defaultProps, vertical: true },
          index: 0,
        })
      ).toBe(50);
    });
    test("checkNeighbors", () => {
      expect(utils.checkNeighbors(false, [20, 40])).toBeTruthy();
      expect(utils.checkNeighbors(false, [20])).toBeFalsy();
    });
    test("ensureValueCorrectNeighbors", () => {
      expect(
        utils.ensureValueCorrectNeighbors({
          value: 20,
          props: defaultProps,
          index: 0,
        })
      ).toBe(20);
      expect(
        utils.ensureValueCorrectNeighbors({
          value: 40,
          props: { ...defaultProps, values: [40, 60], push: 10 },
          index: 1,
        })
      ).toBe(50);
    });
    test("calcValueWithEnsure", () => {
      expect(
        utils.calcValueWithEnsure({
          value: 20,
          props: defaultProps,
          index: 0,
        })
      ).toBe(20);
      expect(
        utils.calcValueWithEnsure({
          value: 80,
          props: { ...defaultProps, values: [40, 60], push: 10, max: 50 },
          index: 1,
        })
      ).toBe(50);
    });
  });
});
