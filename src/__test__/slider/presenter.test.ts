import $ from "jquery";
import { prepareData } from "../../helpers/utils";
import { defaultProps } from "../../slider/index";
import Model from "../../slider/model";
import View from "../../slider/view";
import Presenter from "../../slider/presenter";

describe("slider", () => {
  describe("presenter", () => {
    test("check new presenter", () => {
      const model = new Model(prepareData());
      const view = new View();
      const presenter = new Presenter(model, view);
      expect(presenter).toBeInstanceOf(Presenter);
    });
    test("check subscribe, publish presenter", () => {
      const className = "slider__wrapper7";
      $("body").append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      const model = new Model(prepareData());
      const view = new View();
      const presenter = new Presenter(model, view);
      view.render($parent);
      view.publish("setPropsModel", [18]);
      let props = model.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          values: expect.arrayContaining([18]),
        })
      );

      expect(props.values.length).toBe(1);

      view.publish("setPropsModel", [42, 14]);
      props = model.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          values: expect.arrayContaining([14, 42]),
        })
      );
      expect(props.values.length).toBe(2);

      model.publish("setPropsView", {
        ...defaultProps,
        values: [50],
        step: 10,
        dot: { on: true },
      });
      const $dot = $(".slider__dot", $parent);
      expect($dot.length).toBe(11);

      const $handle = $(".slider__handle", $parent);
      expect($handle.length).toBe(1);
    });
  });
});
