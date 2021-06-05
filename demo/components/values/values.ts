import isObject from 'lodash.isobject';
import isUndefined from 'lodash.isundefined';
import bind from 'bind-decorator';

import ValuesItem from '../values-item';

type ValuesProps = Partial<{
  parent: HTMLElement;
  items: { value: number }[] | null;
}> | null;

class Values {
  constructor(props?: ValuesProps) {
    this.init(props);
  }

  private props?: ValuesProps;

  private $element?: JQuery<HTMLElement> | null;

  private $buttonAdd?: JQuery<HTMLElement> | null;

  private $buttonRemove?: JQuery<HTMLElement> | null;

  private $items?: JQuery<HTMLElement> | null;

  private items: ValuesItem[] = [];

  private static className = `values`;

  private static query = `.js-${Values.className}`;

  private init(props?: ValuesProps) {
    if (props && isObject(props)) {
      this.props = props;
      const { parent } = this.props;
      this.$element = $(Values.query, parent);
      this.$buttonAdd = $(`${Values.query}__control-item-add`, this.$element);
      this.$buttonRemove = $(
        `${Values.query}__control-item-remove`,
        this.$element
      );
      this.toggleVisibleButtonRemove();
      this.bindEventListeners();
      this.$items = $(`${Values.query}__item`, this.$element);
      console.log('this.$items : ', this.$items);
      this.$items.each(this.createItem);
    }
  }

  @bind
  private createItem(index: number, element: HTMLElement) {
    const { items } = this.props || {};
    const { value } = items?.[index] || {};
    console.log('createItem : ', value);
    if (!isUndefined(value)) {
      this.items[index] = new ValuesItem({
        parent: element,
        index,
        value: String(value),
        handleButtonRemoveClick: this.handleButtonRemoveClick,
      });
    }
  }

  private bindEventListeners() {
    this.$buttonAdd?.on('click', this.handleButtonAddClick);
  }

  @bind
  private handleButtonAddClick(): void {
    // const { handleButtonAddClick } = this.props || {};
    // if (handleButtonClick) {
    // }
  }

  @bind
  private handleButtonRemoveClick(index?: number): void {
    // const { handleButtonAddClick } = this.props || {};
    // if (handleButtonClick) {
    // }
    console.log('handleButtonRemoveClick : ', index);
  }

  private toggleVisibleButtonRemove(flag?: boolean) {
    const { items } = this.props || {};
    let readyFlag = flag;
    if (isUndefined(flag)) {
      readyFlag = Boolean(items?.length);
    }
    this.$element?.toggleClass(`${Values.className}__hidden`, readyFlag);
  }
}

export default Values;
