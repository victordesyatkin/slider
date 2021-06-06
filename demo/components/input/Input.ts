import Component from '../../helpers';
import { ComponentProps, InputProps } from '../../modules/types';

class Input extends Component<InputProps> {
  constructor(options?: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'input';

  public query = `.js-${this.className}`;

  public init(): void {
    const { value } = this.props || {};
    this.$input = $(`${this.query}__input`, this.$element);
    this.$input.val(String(value));
  }

  public setValue(value: unknown): void {
    this.$input?.val(String(value));
  }

  public getValue(): string | number | string[] | undefined {
    return this.$input?.val();
  }

  private $input?: JQuery<HTMLElement> | null;
}

export default Input;
