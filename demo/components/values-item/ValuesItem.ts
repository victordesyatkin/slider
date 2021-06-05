import bind from 'bind-decorator';
import isUndefined from 'lodash.isundefined';

import Button from '../button';
import Input from '../input';

type ValueItemProps = Partial<{
  parent: HTMLElement;
  value: string;
  index: number;
  handleButtonRemoveClick: (index?: number) => void;
}> | null;

class ValueItem {
  constructor(props?: ValueItemProps) {
    this.init(props);
  }

  public getValue(): string | number | string[] | undefined {
    return this.input?.getValue();
  }

  private $element?: JQuery<HTMLElement> | null;

  private $index?: JQuery<HTMLElement> | null;

  private $input?: JQuery<HTMLElement> | null;

  private input?: Input | null;

  private $buttonRemove?: JQuery<HTMLElement> | null;

  private buttonRemove?: Button | null;

  private static className = `values-item`;

  private static query = `.js-${ValueItem.className}`;

  private props?: ValueItemProps;

  private init(props?: ValueItemProps) {
    if (props) {
      this.props = props;
      const { parent, value } = props || {};
      if (parent) {
        this.$element = $(ValueItem.query, parent);
        this.$index = $(`${ValueItem.query}__index`, this.$element);
        this.$input = $(`${ValueItem.query}__input`, this.$element);
        this.input = new Input({ parent: this.$input, value });
        this.$buttonRemove = $(`${ValueItem.query}__control`, this.$element);
        console.log('this.$buttonRemove : ', this.$buttonRemove);
        this.buttonRemove = new Button({
          parent: this.$buttonRemove,
          handleButtonClick: this.handleButtonRemoveClick,
        });
      }
    }
  }

  @bind
  private handleButtonRemoveClick() {
    console.log('handleButtonRemoveClick :');
    const { handleButtonRemoveClick, index } = this.props || {};
    if (handleButtonRemoveClick) {
      handleButtonRemoveClick(index);
    }
  }

  private setIndex() {
    const { index } = this.props || {};
    if (!isUndefined(index)) {
      this.$index?.text(index);
    }
  }
}

export default ValueItem;
