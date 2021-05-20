import JQuery from 'jquery';
import pick from 'lodash.pick';

import { Props, DefaultProps, KeyDefaultProps } from '../types';
import { IPresenter } from '../interfaces';
import Presenter from '../Presenter';

class Slider {
  static PLUGIN_NAME = 'slider';

  private presenter: IPresenter;

  static createSlider($element: JQuery<HTMLElement>, props?: Props): JQuery {
    return $element.each(function each() {
      const $this = JQuery(this);
      if (!$this.data(Slider.PLUGIN_NAME)) {
        $this.data(Slider.PLUGIN_NAME, new Slider($this, props));
      } else if ($this.data(Slider.PLUGIN_NAME)) {
        const slider: Slider = $this.data(Slider.PLUGIN_NAME) as Slider;
        if (slider) {
          slider.setProps(props);
        }
      }
    });
  }

  constructor(element: JQuery<HTMLElement>, props?: Props) {
    this.presenter = new Presenter(element, props);
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

export default Slider;
