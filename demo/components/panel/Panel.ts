import bind from 'bind-decorator';
import isObject from 'lodash.isobject';

import { Props } from '../../../src/types';
import { ComponentProps, PanelProps } from '../../modules/types';
import Component from '../../helpers';
import Section from '../section';

class Panel extends Component<PanelProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'panel';

  public query = `.js-${this.className}`;

  public init(): void {
    this.$sections = $(`${this.query}__section-item`, this.$element);
    this.$sections.each(this.createSection);
  }

  public getValues(): Props {
    let props: Props = {};
    if (this.sections && isObject(this.sections)) {
      Object.values(this.sections).forEach((section: Section) => {
        props = {
          ...props,
          ...section.getValues(),
        };
      });
    }
    return props;
  }

  public setValues(values?: Props): void {
    if (values && Array.isArray(this.sections)) {
      this.sections.forEach((section: Section) => {
        section.setValues(values);
      });
    }
    return undefined;
  }

  private $sections?: JQuery<HTMLElement> | null;

  private sections?: Section[] | null = [];

  @bind
  private createSection(index: number, element: HTMLElement) {
    const { sections, handleInputFocusout } = this.props || {};
    const props = sections?.[index];
    if (props && Array.isArray(this.sections)) {
      this.sections[index] = new Section({
        parent: element,
        props: { ...props, handleInputFocusout },
      });
    }
  }
}

export default Panel;
