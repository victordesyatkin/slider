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
    // console.log('this.$slider : ', this.$slider);
    this.slider = this.$slider
      .slider(this.props)
      .data(Slider.PLUGIN_NAME) as Slider;
    // console.log('this.slider : ', this.slider);
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
