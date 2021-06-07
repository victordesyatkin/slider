import bind from 'bind-decorator';

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
    console.log('this.section : ', this.sections?.[0].getValue());
  }

  private $sections?: JQuery<HTMLElement> | null;

  private sections?: Section[] | null = [];

  @bind
  private createSection(index: number, element: HTMLElement) {
    const { sections } = this.props || {};
    const props = sections?.[index];
    if (props && Array.isArray(this.sections)) {
      // console.log('props : ', props);
      this.sections[index] = new Section({
        parent: element,
        props,
      });
    }
  }
}

export default Panel;
