import isFunction from 'lodash.isfunction';
import bind from 'bind-decorator';

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
    const { value, handleInputFocusout } = this.props || {};
    this.$input = $(`${this.query}__input`, this.$element);
    this.$input.on({
      input: this.handleInputInput,
      focusout: handleInputFocusout,
    });
    this.setValue(value);
  }

  public setValue(value: unknown): void {
    if (this.props) {
      const { type } = this.props;
      if (type === 'checkbox') {
        this.$input?.prop('checked', Boolean(parseInt(String(value), 10)));
      }
      this.$input?.val(String(value));
    }
  }

  public getValue(): string | number | string[] | undefined {
    return this.$input?.val();
  }

  @bind
  private handleInputInput(
    event: JQuery.EventBase<any, any, any, HTMLInputElement>
  ): void {
    if (this.props) {
      const { handleInputInput, type } = this.props || {};
      if (type === 'checkbox') {
        let value = this.$input?.val();
        value = Number(!parseInt(String(value), 10));
        this.$input?.val(value);
      }
      if (handleInputInput && isFunction(handleInputInput)) {
        const { target } = event;
        const { value } = target;
        handleInputInput(value);
      }
    }
    return undefined;
  }

  private $input?: JQuery<HTMLElement> | null;
}

export default Input;
