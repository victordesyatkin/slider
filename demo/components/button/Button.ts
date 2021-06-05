import { ButtonProps } from '../../modules/types';

class Button {
  constructor(props?: ButtonProps) {
    this.init(props);
  }

  private props?: ButtonProps;

  private $element?: JQuery<HTMLElement> | null;

  private static className = 'button';

  private static query = `.js-${Button.className}`;

  private init(props?: ButtonProps) {
    if (props) {
      this.props = props;
      const { parent } = this.props || {};
      if (parent) {
        this.$element = $(Button.query, parent);
        this.bindEventListeners();
      }
    }
  }

  private bindEventListeners() {
    const { handleButtonClick } = this.props || {};
    if (handleButtonClick) {
      this.$element?.on('click', handleButtonClick);
    }
  }
}

export default Button;
