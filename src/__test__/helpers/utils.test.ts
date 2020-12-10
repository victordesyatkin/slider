import * as utils from "../../helpers/utils";
import $ from "jquery";

describe("helpers", () => {
  describe("utils", () => {
    test("style?: { [key: string]: string } -> objectToString -> string", () => {
      expect(utils.objectToString()).toEqual("");
      expect(utils.objectToString({ width: "100%", height: "100%" })).toEqual(
        "width: 100%;height: 100%;"
      );
    });
    test("value, min, max, precision? = 0 -> calcOffset -> number", () => {
      expect(utils.calcOffset(5, 0, 100)).toEqual(5);
      expect(utils.calcOffset(25, 0, 100)).toEqual(25);
      expect(utils.calcOffset(-5, 0, 100)).toEqual(0);
      expect(utils.calcOffset(-5, -100, 100)).toEqual(48);
      expect(utils.calcOffset(0, -100, 100)).toEqual(50);
    });
    test("vertical, HTMLElement -> getHandleCenterPosition -> number", () => {
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
      document.body.innerHTML = `<div class="class1" style="width:100px;height:100px;">hohoho</div>`;
      let el = $(".class1").get(0);
      expect(utils.getHandleCenterPosition(false, el)).toEqual(50);
      document.body.innerHTML = "";
      document.body.innerHTML = `<div class="class2" style="width:50px;height:200px;">j2j2j2</div>`;
      el = $(".class2").get(0);
      expect(utils.getHandleCenterPosition(true, el)).toEqual(100);
    });
    test("val: number, { max, min }: { max: number; min: number } -> ensureValueInRange -> number", () => {
      expect(utils.ensureValueInRange(4, { min: -70, max: 30 })).toEqual(4);
      expect(utils.ensureValueInRange(100, { min: -70, max: 30 })).toEqual(30);
      expect(utils.ensureValueInRange(-200, { min: -70, max: 30 })).toEqual(
        -70
      );
      expect(utils.ensureValueInRange(16, { min: 0, max: 4 })).toEqual(4);
    });
    test("(vertical: boolean, e: MouseEvent): number -> getMousePosition -> number", () => {
      let e = new MouseEvent("mousemove", {
        screenX: 4,
        screenY: 16,
        clientY: 22,
      });
      expect(utils.getMousePosition(true, e)).toEqual(22);
      e = new MouseEvent("click", {
        screenX: 4,
        screenY: 40,
        clientY: 22,
      });
      expect(utils.getMousePosition(false, e)).toEqual(0);
    });
    test("(step: number): number -> getPrecision -> number", () => {
      expect(utils.getPrecision(1.2452)).toEqual(4);
      expect(utils.getPrecision(25)).toEqual(0);
    });
  });
});
