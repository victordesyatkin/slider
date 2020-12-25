import JQuery from "jquery";

import { Props } from "./types";
import { Slider, createSlider } from "./slider/index";
import "./style.scss";

(function ($: JQueryStatic) {
  $.fn.slider = function (props?: Props): JQuery {
    return createSlider(this, props);
  };
})(JQuery);

export default Slider;
