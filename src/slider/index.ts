import JQuery from "jquery";
import noop from "lodash/noop";
import pick from "lodash/pick";
import omit from "lodash/omit";

import { prepareValues, prepareData } from "../helpers/utils";
import { Props, DefaultProps, KeyDefaultProps } from "../types";
import { IModel, IView, IPresenter } from "./interface";
import Model from "./model";
import View from "./view";
import Presenter from "./presenter";

const defaultProps: DefaultProps = {
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
};

class Slider {
  static PLUGIN_NAME = "slider";
  private model: IModel;
  private view: IView;
  private presenter: IPresenter;

  constructor(element: JQuery<HTMLElement>, props: Props) {
    const mergeProps: DefaultProps = prepareData(props);
    this.model = new Model(mergeProps);
    this.view = new View();
    this.presenter = new Presenter(this.model, this.view);
    this.view.render(element);
  }

  getProps(): DefaultProps {
    return this.model.getProps();
  }

  setProps(props: Props): void {
    this.model.setProps(props);
  }

  pickProps<T extends KeyDefaultProps>(keys: T[]): Partial<DefaultProps> {
    return pick(this.model.getProps(), keys);
  }
}

function createSlider(props: Props, $el: JQuery<HTMLElement>): JQuery {
  return $el.each(function () {
    const $this = JQuery(this);
    if (!$this.data(Slider.PLUGIN_NAME)) {
      $this.data(Slider.PLUGIN_NAME, new Slider($this, props));
    } else {
      const slider = $this.data(Slider.PLUGIN_NAME);
      if (slider) {
        slider.setProps(props);
      }
    }
  });
}

(function ($: JQueryStatic) {
  $.fn.slider = function (props: Props): JQuery {
    return createSlider(props, this);
  };
})(JQuery);

export { Slider, createSlider, defaultProps };
