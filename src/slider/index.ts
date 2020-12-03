import JQuery from "jquery";
import { tProps } from "../types";
import Model from "./model";
import View from "./view";

(function ($) {
  $.fn.slider = function (props: tProps): JQuery {
    const model = new Model(props);
    const view = new View(model);
    return this;
  };
})(JQuery);
