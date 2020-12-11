import JQuery from "jquery";
import merge from "lodash/merge";
import noop from "lodash/noop";
import pick from "lodash/pick";
import { Props, DefaultProps, KeyDefaultProps } from "../types";
import { prepareProps } from "../helpers/utils";
import Model from "./model";
import View from "./view";
import Presenter from "./presenter";
import { IModel, IView, IPresenter } from "./interface";

export const defaultProps: DefaultProps = {
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

export default class Slider {
  static PLUGIN_NAME = "slider";
  private model: IModel;
  private view: IView;
  private presenter: IPresenter;

  constructor(element: JQuery<HTMLElement>, props: Props) {
    const mergeProps: DefaultProps = prepareProps(
      merge({ ...defaultProps }, props)
    );
    this.model = new Model(mergeProps);
    this.view = new View(element);
    this.presenter = new Presenter(this.model, this.view);
    this.presenter.render(element);
  }

  getProps(): DefaultProps {
    return this.model.getProps();
  }

  setProps(props: DefaultProps): void {
    const mergeProps: DefaultProps = prepareProps(
      merge({ ...defaultProps }, this.getProps(), props)
    );
    this.model.setProps(mergeProps);
  }

  pickProps<T extends KeyDefaultProps>(keys: T[]): Partial<DefaultProps> {
    return pick(this.model.getProps(), keys);
  }
}

(function ($) {
  $.fn.slider = function (props: Props): JQuery {
    return this.each(function () {
      const $this = $(this);
      if (!$this.data(Slider.PLUGIN_NAME)) {
        $this.data(Slider.PLUGIN_NAME, new Slider($this, props));
      } else {
        const slider = $this.data(Slider.PLUGIN_NAME);
        if (slider) {
          slider.setProps(props);
        }
      }
    });
  };
})(JQuery);
