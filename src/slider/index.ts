import JQuery from "jquery";
import { tProps } from "../types";
import Model from "./model";
import View from "./view";
import Presenter from "./presenter";

(function ($) {
  $.fn.slider = function (props: tProps): JQuery {
    const model = new Model(props);
    const presenter = new Presenter(model);
    const view = new View(model, presenter);
    this.append(view.render());
    return this;
  };
})(JQuery);
