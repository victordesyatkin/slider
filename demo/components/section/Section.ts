import bind from 'bind-decorator';
import isObject from 'lodash.isobject';
import trim from 'lodash.trim';

import { Props, KeyProps } from '../../../src/types';
import { ComponentProps, SectionProps, ItemProps } from '../../modules/types';
import Component, {
  valueToProp,
  prepareValues,
  propsToValue,
  checkedIsEqual,
} from '../../helpers';
import Values from '../values';
import Input from '../input';

class Section extends Component<SectionProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'section';

  public query = `.js-${this.className}`;

  public init(): void {
    const { items = [] } = this.props || {};
    items.forEach(this.createItem);
  }

  public getValues(): Props | undefined | null {
    if (this.items && isObject(this.items)) {
      Object.keys(this.items).forEach((key) => {
        const parts = key.split('-');
        const [type, property] = parts;
        const value = valueToProp({
          value: this.items[key].getValue(),
          property,
        });
        this.values = prepareValues({
          value,
          type: type as KeyProps,
          property,
          values: this.values || {},
        });
      });
    }
    return this.values;
  }

  public setValues(values?: Props): void {
    if (this.items && isObject(this.items)) {
      Object.keys(this.items).forEach((key: string) => {
        const item: Values | Input | null | undefined = this.items[key];
        const parts = trim(key).split('-') || [];
        const [type, property] = parts;
        const isCorrect = type && property && item;
        if (isCorrect) {
          const prev = valueToProp({
            value: item.getValue(),
            property,
          });
          const next = propsToValue({
            type,
            property,
            values,
          });
          if (!checkedIsEqual({ prev, next })) {
            item.setValue(next);
          }
        }
      });
    }
  }

  @bind
  private createItem(props?: ItemProps) {
    const { handleInputFocusout } = this.props || {};
    const { data } = props || {};
    const { type, property } = data || {};
    if (type && property) {
      const key = `${type}-${property}`;
      const $item = $(
        `${this.query}__item[data-type=${type}][data-property=${property}]`,
        this.$element
      );
      this.$item[key] = $item;
      let item: Values | Input | null | undefined;
      if (property === 'values') {
        item = new Values({
          parent: $item,
          props: { ...props, handleInputFocusout },
        });
      } else {
        item = new Input({
          parent: $item,
          props: { ...props, handleInputFocusout },
        });
      }
      this.items[key] = item;
    }
  }

  private values?: Props | null;

  private $item: Record<string, JQuery<HTMLElement> | null> = {};

  private items: Record<string, Values | Input> = {};
}

export default Section;
