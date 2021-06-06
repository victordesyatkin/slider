import { ComponentProps, SectionProps } from '../../modules/types';
import Component from '../../helpers';
import Section from '../section';

class Panel extends Component<{ sections: SectionProps[] }> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'panel';

  public query = `js-${this.className}`;

  public init(): void {
    this.$sections = $(`${this.query}__section-item`, this.$element);
    this.$sections.each(this.createSection);
  }

  private $sections?: JQuery<HTMLElement> | null;

  private sections?: Section[] | null = [];

  private createSection(index: number, element: HTMLElement) {
    const { sections } = this.props || {};
    if (Array.isArray(this.sections)) {
      this.sections[index] = new Section({
        parent: element,
        props: sections?.[index],
      });
    }
  }
}

export default Panel;
