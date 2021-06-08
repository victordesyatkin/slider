import bind from 'bind-decorator';
import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';

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
    this.$element?.on({ focusout: this.handlePanelFocusout });
    this.$sections = $(`${this.query}__section-item`, this.$element);
    this.$sections.each(this.createSection);
    // console.log('this.section : ', this.sections?.[0]);
    // console.log('this.section values: ', this.sections?.[0].getValues());
  }

  public getValues(): Props {
    let props: Props = {};
    if (this.sections && isObject(this.sections)) {
      // console.log('this.sections : ', this.sections?.[0].getValues());
      Object.values(this.sections).forEach((section: Section) => {
        // console.log('this.sections : ', section.getValues());
        props = { ...props, ...section.getValues() };
      });
    }
    // console.log('props : ', props);
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

  @bind handlePanelFocusout(): void {
    if (this.props) {
      const { handlePanelFocusout } = this.props;
      if (handlePanelFocusout && isFunction(handlePanelFocusout)) {
        handlePanelFocusout();
      }
    }
    return undefined;
  }
}

export default Panel;
