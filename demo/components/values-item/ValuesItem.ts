import bind from 'bind-decorator';
import isUndefined from 'lodash.isundefined';
import isFunction from 'lodash.isfunction';

import { ComponentProps, ValueItemProps } from '../../modules/types';
import Component from '../../helpers';
import Button from '../button';
import Input from '../input';

class ValueItem extends Component<ValueItemProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public getValue(): string | number | string[] | undefined {
    return this.input?.getValue();
  }

  public className = `values-item`;

  public query = `.js-${this.className}`;

  public init(): void {
    const { value } = this.props || {};
    if (!isUndefined(value)) {
      this.$index = $(`${this.query}__index`, this.$element);
      this.$input = $(`${this.query}__input`, this.$element);
      this.input = new Input({
        parent: this.$input,
        props: {
          value,
          handleInputInput: this.handleInputInput,
          handleInputFocusout: this.handleInputFocusout,
        },
      });
      this.$buttonRemove = $(`${this.query}__control`, this.$element);
      if (this.$buttonRemove && this.$buttonRemove.length) {
        this.buttonRemove = new Button({
          parent: this.$buttonRemove,
          props: {
            handleButtonClick: this.handleButtonRemoveClick,
          },
        });
      }
      this.setIndex();
    }
  }

  private $index?: JQuery<HTMLElement> | null;

  private $input?: JQuery<HTMLElement> | null;

  private input?: Input | null;

  private $buttonRemove?: JQuery<HTMLElement> | null;

  private buttonRemove?: Button | null;

  @bind
  private handleButtonRemoveClick() {
    const { handleButtonRemoveClick, index } = this.props || {};
    if (handleButtonRemoveClick && isFunction(handleButtonRemoveClick)) {
      handleButtonRemoveClick(index);
    }
  }

  @bind
  private handleInputInput(options?: Partial<{ value: string }>) {
    const { value } = options || {};
    const { handleInputInput, index, type } = this.props || {};
    if (handleInputInput && isFunction(handleInputInput)) {
      handleInputInput({ index, value, type });
    }
  }

  @bind
  private handleInputFocusout(options?: Partial<{ value: string }>) {
    const { value } = options || {};
    const { handleInputFocusout, index, type } = this.props || {};
    if (handleInputFocusout && isFunction(handleInputFocusout)) {
      handleInputFocusout({ index, value, type });
    }
  }

  private setIndex() {
    const { index = 0 } = this.props || {};
    if (!isUndefined(index)) {
      this.$index?.text(`${index + 1}:`);
    }
  }
}

export default ValueItem;
