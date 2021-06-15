import isUndefined from 'lodash.isundefined';
import isFunction from 'lodash.isfunction';
import bind from 'bind-decorator';

import { ValuesProps, ComponentProps } from '../../modules/types';
import Component from '../../helpers';
import ValuesItem from '../values-item';
import ValueItem from '../values-item/ValuesItem';
import Button from '../button';

class Values extends Component<ValuesProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = `values`;

  public query = `.js-${this.className}`;

  public getValue(): number[] {
    const { value = [] } = this.props || {};
    return value;
  }

  public setValue(value?: unknown): void {
    if (this.props && Array.isArray(value)) {
      this.props.value = value;
      this.renderUl();
    }
  }

  public init(): void {
    this.$template = $(`${this.query}__template`, this.$element);
    this.$content = $(`${this.query}__content`, this.$element);
    this.$buttonAdd = $(`${this.query}__control-item-add`, this.$element);
    this.buttonAdd = new Button({
      parent: this.$buttonAdd,
      props: {
        handleButtonClick: this.handleButtonAddClick,
      },
    });
    this.$buttonRemove = $(`${this.query}__control-item-remove`, this.$element);
    this.buttonRemove = new Button({
      parent: this.$buttonRemove,
      props: {
        handleButtonClick: this.handleButtonRemoveClick,
      },
    });
    this.toggleVisibleButtonRemove();
    this.$items = $(`${this.query}__item`, this.$element);
    this.$items.each(this.createValuesItem);
  }

  private $template?: JQuery<HTMLElement> | null;

  private $content?: JQuery<HTMLElement> | null;

  private $buttonAdd?: JQuery<HTMLElement> | null;

  private buttonAdd?: Button | null;

  private $buttonRemove?: JQuery<HTMLElement> | null;

  private buttonRemove?: Button | null;

  private $items?: JQuery<HTMLElement> | null;

  private items: ValuesItem[] = [];

  private createUl() {
    return $('<ul/>', {
      class: `${this.className}__items js-${this.className}__items`,
    });
  }

  private createLi() {
    return $('<li/>', {
      class: `${this.className}__item js-${this.className}__item`,
    });
  }

  @bind
  private createValuesItem(index: number, element: HTMLElement) {
    const { value, handleInputFocusout } = this.props || {};
    if (Array.isArray(value)) {
      const item = value[index];
      this.items[index] = new ValuesItem({
        parent: element,
        props: {
          index,
          value: item,
          handleButtonRemoveClick: this.handleButtonRemoveClick,
          handleInputInput: this.handleInputInput,
          handleInputFocusout,
        },
      });
    }
  }

  private renderUl() {
    const { value, handleInputFocusout } = this.props || {};
    const html = this.$template?.html();
    if (html && Array.isArray(value)) {
      this.$content?.empty();
      this.items = [];
      if (value.length) {
        const $ul = this.createUl();
        value.forEach((item, index) => {
          const $li = this.createLi();
          $li.append(html);
          this.items[index] = new ValueItem({
            parent: $li,
            props: {
              ...this.props,
              value: item,
              index,
              handleButtonRemoveClick: this.handleButtonRemoveClick,
              handleInputInput: this.handleInputInput,
              handleInputFocusout,
            },
          });
          $ul.append($li);
        });
        this.$content?.append($ul);
        this.toggleVisibleButtonRemove();
      } else {
        const $p = $('<p/>', {
          class: `${this.className}__no-content js-${this.className}__no-content`,
          text: 'No content',
        });
        this.$content?.append($p);
      }
    }
  }

  @bind
  private handleButtonAddClick(): void {
    this.props = {
      ...this.props,
      value: [...(this.props?.value || []), 0],
    };
    this.renderUl();
    const { handleButtonAddClick, handleInputFocusout } = this.props || {};
    if (handleButtonAddClick) {
      handleButtonAddClick();
    }
    if (isFunction(handleInputFocusout)) {
      handleInputFocusout({ type: 'values' });
    }
  }

  @bind
  private handleButtonRemoveClick(index?: number): void {
    const { handleButtonRemoveClick, handleInputFocusout } = this.props || {};
    const { value } = this.props || {};
    const valueLength = value?.length;
    if (Array.isArray(value) && valueLength) {
      let readyIndex = parseFloat(String(index));
      readyIndex = Number.isNaN(readyIndex) ? 1 : Number(index);
      const readyValue = [...value];
      readyValue.splice(readyIndex, 1);
      this.props = {
        ...this.props,
        value: readyValue,
      };
      this.renderUl();
      this.toggleVisibleButtonRemove();
      if (isFunction(handleInputFocusout)) {
        handleInputFocusout({ type: 'values' });
      }
      if (handleButtonRemoveClick) {
        handleButtonRemoveClick();
      }
    }
  }

  @bind
  handleInputInput(options?: { index?: number; value?: string }): void {
    if (this.props) {
      const { index, value } = options || {};
      const readyValue = parseFloat(String(value));
      const { value: prev } = this.props || {};
      const readyIndex = parseInt(String(index), 10);
      if (Array.isArray(prev) && !Number.isNaN(readyIndex)) {
        if (typeof readyIndex === 'number') {
          const readyPrev = [...prev];
          readyPrev[readyIndex] = readyValue;
          this.props.value = readyPrev;
        }
      }
    }
  }

  private toggleVisibleButtonRemove(flag?: boolean) {
    const { value } = this.props || {};
    let readyFlag = flag;
    if (isUndefined(flag)) {
      readyFlag = Boolean(value?.length);
    }
    if (readyFlag) {
      this.buttonRemove?.enabled();
    } else {
      this.buttonRemove?.disabled();
    }
  }
}

export default Values;
