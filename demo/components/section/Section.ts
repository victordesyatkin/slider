import bind from 'bind-decorator';
import isObject from 'lodash.isobject';

import { defaultProps } from '../../../src/helpers/utils';
import { DefaultProps, Props } from '../../../src/types';
import { ComponentProps, SectionProps, ItemProps } from '../../modules/types';
import Component from '../../helpers';
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

  public getValue(): unknown {
    let props: Props = {};
    Object.keys(this.sections).forEach((key) => {
      const parts = key.split('-');
      if (Array.isArray(parts) && parts.length) {
        const [type, property] = parts;
        const value = this.sections[key].getValue();
        const readyType = type as keyof Props;
        if (type && type === property) {
          props = {
            ...props,
            [readyType]: value,
          };
        } else if (readyType && property) {
          props = {
            ...props,
            [readyType]: {
              ...(props[readyType] || {}),
              [property]: value,
            },
          };
        }
      }
    });
    return props;
  }

  // public setValue(value?: unknown): void {
  //   this.item?.setValue(value);
  // }

  @bind
  private createItem(item?: ItemProps) {
    // console.log('createItem', item);
    const { data } = item || {};
    const { type, property } = data || {};
    if (type && property) {
      const key = `${type}-${property}`;
      const $section = $(
        `${this.query}__item[data-type=${type}][data-property=${property}]`,
        this.$element
      );
      // console.log('$section', $section);
      this.$sections[key] = $section;
      let section: Values | Input | null | undefined;
      if (property === 'values') {
        section = new Values({
          parent: $section,
          props: item,
        });
      } else {
        section = new Input({
          parent: $section,
          props: item,
        });
      }
      this.sections[key] = section;
    }
  }

  private $sections: Record<string, JQuery<HTMLElement> | null> = {};

  private sections: Record<string, Values | Input> = {};
}

export default Section;
