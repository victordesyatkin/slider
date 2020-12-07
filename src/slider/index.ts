import JQuery from "jquery";
import merge from "lodash/merge";
import noop from "lodash/noop";
import { tProps, tDefaultProps } from "../types";
import Model from "./model";
import View from "./view";
import Presenter from "./presenter";

export const defaultProps: tDefaultProps = {
  prefixCls: "slider",
  values: [0],
  min: 0,
  max: 100,
  onBeforeChange: noop,
  onChange: noop,
  onAfterChange: noop,
  disabled: false,
  track: { on: true },
  rail: { on: true },
  vertical: false,
  reverse: false,
  allowCross: false,
  precision: 0,
  type: "slider",
};

(function ($) {
  $.fn.slider = function (props: tProps): JQuery {
    const mergeProps: tDefaultProps = merge(defaultProps, props);
    const model = new Model(mergeProps);
    const view = new View(this);
    const presenter = new Presenter(model, view);
    presenter.render(this);
    return this;
  };
})(JQuery);
