import TrackView from "../../components/track/view";
import $ from "jquery";
import { defaultProps } from "../../slider/index";
import { setFunctionGetBoundingClientRectHTMLElement } from "../../helpers/utils";
import { Rail, Dot, Mark, Tooltip } from "../../types";

describe("rail", () => {
  describe("view", () => {
    test("create track view", () => {
      const addition = { index: 0 };
      const view = new TrackView(addition);
      expect(view).toBeInstanceOf(TrackView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test("render track view", () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $("body").append('<div class="slider__wrapper"/>');
      const addition = { index: 0 };
      const view = new TrackView(addition);
      const $parent = $(".slider__wrapper");
      view.render($parent);
      let $el = $(".slider__track", $parent);
      expect($el.length).toBe(0);

      view.setProps(defaultProps);
      $el = $(".slider__track", $parent);
      expect($el.length).toBe(1);

      view.setProps({ ...defaultProps, track: { on: false } });
      $el = $(".slider__track", $parent);
      expect($el.length).toBe(0);
    });
  });
});
