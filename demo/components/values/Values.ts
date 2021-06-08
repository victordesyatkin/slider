import isObject from 'lodash.isobject';
import isUndefined from 'lodash.isundefined';
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
    console.log('Values setValue : ', value);
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
    // console.log('this.$items : ', this.$items);
  }

  private $template?: JQuery<HTMLElement> | null;

  private $ul?: JQuery<HTMLElement> | null;

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
    const { value } = this.props || {};
    if (Array.isArray(value)) {
      const item = value[index];
      // console.log('createItem : ', item);
      this.items[index] = new ValuesItem({
        parent: element,
        props: {
          index,
          value: item,
          handleButtonRemoveClick: this.handleButtonRemoveClick,
          handleInputInput: this.handleInputInput,
        },
      });
    }
  }

  private renderUl() {
    const { value, data } = this.props || {};
    const { type } = data || {};
    if (type === 'mark') {
      console.log('renderUl value : ', value);
    }
    const html = this.$template?.html();
    if (html && Array.isArray(value)) {
      this.$content?.empty();
      this.items = [];
      if (value.length) {
        const $ul = this.createUl();
        value.forEach((item, index) => {
          console.log('renderUl item : ', item);
          console.log('renderUl index : ', index);
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
            },
          });
          $ul.append($li);
        });
        this.$content?.append($ul);
        this.toggleVisibleButtonRemove();
        // console.log('renderUl $ul : ', $ul);
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
    const { handleButtonAddClick } = this.props || {};
    if (handleButtonAddClick) {
      handleButtonAddClick();
    }
  }

  @bind
  private handleButtonRemoveClick(index?: number): void {
    const { handleButtonRemoveClick } = this.props || {};
    const { value } = this.props || {};
    const valueLength = value?.length;
    // console.log('readyValue : ', value);
    if (Array.isArray(value) && valueLength) {
      let readyIndex = parseFloat(String(index));
      readyIndex = Number.isNaN(readyIndex) ? valueLength - 1 : Number(index);
      const readyValue = [...value];
      readyValue.splice(readyIndex, 1);
      this.props = {
        ...this.props,
        value: readyValue,
      };
      console.log('this.props : ', this.props);
      if (handleButtonRemoveClick) {
        handleButtonRemoveClick();
      }
      this.renderUl();
      this.toggleVisibleButtonRemove();
    }
  }

  @bind
  handleInputInput(options?: { index?: number; value?: string }): void {
    if (this.props) {
      // console.log('options : ', options);
      const { index, value } = options || {};
      let readyValue = parseFloat(String(value));
      if (Number.isNaN(readyValue)) {
        readyValue = 0;
      }
      const { value: prev } = this.props || {};
      const readyIndex = parseInt(String(index), 10);
      if (Array.isArray(prev) && !Number.isNaN(readyIndex)) {
        if (typeof readyIndex === 'number') {
          prev[readyIndex] = readyValue;
          this.props.value = prev;
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
    // console.log('props : ', this.props);
    // console.log('readyFlag : ', readyFlag);
    if (readyFlag) {
      this.buttonRemove?.enabled();
    } else {
      this.buttonRemove?.disabled();
    }
  }
}

export default Values;
