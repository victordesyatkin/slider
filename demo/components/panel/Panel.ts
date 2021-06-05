import { ComponentProps, SectionProps } from '../../modules/types';
import Component from '../../helpers';

class Panel extends Component<{ sections: SectionProps[] }> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'panel';

  public query = `js-${this.className}`;

  public init() {
    this.$sections = $(`${this.query}__section-item`, this.$element);
    this.sections = this.$sections.each(this.createSection);
  }

  private $sections?: JQuery<HTMLElement>;

  private sections?: Section[] = [];

  private createSection(index: number, element: HTMLElement) {
    const { sections } = this.props || {};
    this.sections[index] = new Section({
      parent: element,
      props: sections?.[index],
    });
  }
}

export default Panel;
