import isObject from 'lodash.isobject';
import isUndefined from 'lodash.isundefined';
import bind from 'bind-decorator';

import { ValuesProps, ComponentProps } from '../../modules/types';
import Component from '../../helpers';
import ValuesItem from '../values-item';

class Values extends Component<ValuesProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = `values`;

  public query = `.js-${this.className}`;

  public init(props?: ValuesProps): void {
    if (props && isObject(props)) {
      this.props = props;
      this.$buttonAdd = $(`${this.query}__control-item-add`, this.$element);
      this.$buttonRemove = $(
        `${this.query}__control-item-remove`,
        this.$element
      );
      this.toggleVisibleButtonRemove();
      this.bindEventListeners();
      this.$items = $(`${this.query}__item`, this.$element);
      console.log('this.$items : ', this.$items);
      this.$items.each(this.createValuesItem);
    }
  }

  private $buttonAdd?: JQuery<HTMLElement> | null;

  private $buttonRemove?: JQuery<HTMLElement> | null;

  private $items?: JQuery<HTMLElement> | null;

  private items: ValuesItem[] = [];

  @bind
  private createValuesItem(index: number, element: HTMLElement) {
    const { items } = this.props || {};
    if (Array.isArray(items)) {
      const item = items[index];
      console.log('createItem : ', item);
      this.items[index] = new ValuesItem({
        parent: element,
        props: {
          index,
          item,
          handleButtonRemoveClick: this.handleButtonRemoveClick,
        },
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
    this.$element?.toggleClass(`${this.className}__hidden`, readyFlag);
  }
}

export default Values;
