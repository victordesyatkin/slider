import JQuery from 'jquery';
import pick from 'lodash/pick';

import { prepareData } from '../helpers/utils';
import { Props, DefaultProps, KeyDefaultProps } from '../types';
import { IModel, IPresenter, IView } from './interface';
import Model from './model';
import View from './view';
import Presenter from './presenter';

class Slider {
  static PLUGIN_NAME = 'slider';

  private model: IModel;

  private view: IView;

  private presenter: IPresenter;

  constructor(element: JQuery<HTMLElement>, props?: Props) {
    this.model = new Model(prepareData(props));
    this.view = new View();
    this.presenter = new Presenter(this.model, this.view);
    this.view.render(element);
  }

  public getProps(): DefaultProps {
    const defaultProps: DefaultProps = this.presenter.getProps();
    return defaultProps;
  }

  public setProps(props?: Props): void {
    this.presenter.setProps(props);
  }

  public pickProps<T extends KeyDefaultProps>(
    keys: T[]
  ): Partial<DefaultProps> {
    return pick(this.presenter.getProps(), keys);
  }
}

function createSlider($element: JQuery<HTMLElement>, props?: Props): JQuery {
  return $element.each(function each() {
    const $this = JQuery(this);
    if (!$this.data(Slider.PLUGIN_NAME)) {
      $this.data(Slider.PLUGIN_NAME, new Slider($this, props));
    } else if ($this.data(Slider.PLUGIN_NAME) instanceof Slider) {
      const slider: Slider = $this.data(Slider.PLUGIN_NAME) as Slider;
      if (slider) {
        slider.setProps(props);
      }
    }
  });
}

export { Slider, createSlider };
