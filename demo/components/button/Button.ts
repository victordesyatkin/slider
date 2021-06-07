import Component from '../../helpers';
import { ButtonProps, ComponentProps } from '../../modules/types';

class Button extends Component<ButtonProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'button';

  public query = `.js-${this.className}`;

  public init(): void {
    this.bindEventListeners();
  }

  public enabled(): void {
    this.$element?.prop('disabled', false);
  }

  public disabled(): void {
    this.$element?.prop('disabled', true);
  }

  private bindEventListeners() {
    const { handleButtonClick } = this.props || {};
    if (handleButtonClick) {
      this.$element?.on('click', handleButtonClick);
    }
  }
}

export default Button;
