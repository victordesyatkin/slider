import JQuery from "jquery";
import noop from "lodash/noop";
import pick from "lodash/pick";

import { prepareData } from "../helpers/utils";
import { Props, DefaultProps, KeyDefaultProps } from "../types";
import { IModel, IView, IPresenter } from "./interface";
import Model from "./model";
import View from "./view";
import Presenter from "./presenter";

const defaultProps: DefaultProps = {
  prefixCls: "fsd-slider",
  values: [0],
  min: 0,
  max: 100,
  disabled: false,
  track: { on: true },
  rail: { on: true },
  vertical: false,
  reverse: false,
  precision: 0,
  mark: { values: [] },
};

class Slider {
  static PLUGIN_NAME: string = "slider";
  private model: IModel;
  private view: IView;
  private presenter: IPresenter;

  constructor(element: JQuery<HTMLElement>, props?: Props) {
    this.model = new Model(prepareData(props));
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

function createSlider($el: JQuery<HTMLElement>, props?: Props): JQuery {
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

export { Slider, createSlider, defaultProps };
