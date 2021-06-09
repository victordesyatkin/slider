import $ from 'jquery';

import Slider from '../../../src';
import { Props } from '../../../src/types';
import Component from '../../helpers';
import { ComponentProps } from '../../modules/types';

class SliderComponent extends Component<Props> {
  constructor(options?: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = `slider`;

  public query = `.js-${this.className}`;

  public init(): void {
    this.$slider = $(`${this.query}__dummy`, this.$element);
    this.slider = this.$slider
      .slider($.extend(true, {}, this.props))
      .data(Slider.PLUGIN_NAME) as Slider;
  }

  public setProps(props?: Props): void {
    this.slider?.setProps(props);
  }

  public getProps(): Props | undefined {
    return this.slider?.getProps();
  }

  private $slider?: JQuery<HTMLElement> | null;

  private slider?: Slider | null;
}

export default SliderComponent;
