import bind from 'bind-decorator';
import isObject from 'lodash.isobject';

import { ComponentProps, SectionProps, DataProps } from '../../modules/types';
import Component from '../../helpers';
import Values from '../values';

class Section extends Component<SectionProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'section';

  public query = `js-${this.className}`;

  public init(): void {
    const { data } = this.props || {};
    this.$values = $(`${this.query}__values`, this.$element);
    this.$values.each(this.createValues);
  }

  @bind
  private createValues(index: number, element: HTMLElement) {
    if (Array.isArray(this.values)) {
      this.values[index] = new Values({
        parent: element,
        props: this.props,
      });
    }
  }

  private $values?: JQuery<HTMLElement> | null;

  private values?: Values[] | null = [];
}

export default Section;
