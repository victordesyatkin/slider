import $ from "jquery";
global["$"] = global["jQuery"] = $;
import { createSlider } from "../../slider/index";

describe("slider", () => {
  test("createSlider", () => {
    $("body").append('<div id="slider__wrapper"></div>');
    const $el = $("#slider__wrapper");
    expect(createSlider({}, $el)).toHaveLength(1);
  });
});
