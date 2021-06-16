import $ from 'jquery';
import bind from 'bind-decorator';
import set from 'lodash.set';
import isEqual from 'lodash.isequal';

import { Props } from '../../../src/types';
import Slider from '../slider';
import { ComponentProps, ExampleProps } from '../../modules/types';
import Component, { checkedIsEqual } from '../../helpers';
import Panel from '../panel';

class Example extends Component<ExampleProps> {
  constructor(options: ComponentProps) {
    super(options);
    this.renderComponent();
  }

  public className = 'example';

  public query = `.js-${this.className}`;

  public init(): void {
    const { panel } = this.props || {};
    this.panel = new Panel({
      parent: this.$element,
      props: {
        ...panel,
        handleInputInput: this.handleInputInput,
        handleInputFocusout: this.handleInputFocusout,
      },
    });
    this.values = this.panel.getValues();
    this.slider = new Slider({
      parent: this.$element,
      props: $.extend(
        {},
        {
          ...this.values,
          values: [...(this.values?.values || [])],
          onAfterChange: this.onAfterChange,
        }
      ),
    });
    this.setValues();
  }

  private panel?: Panel | null;

  private slider?: Slider | null;

  private values?: Props | null;

  @bind
  private handleInputInput(options: Partial<{ type: string }>): void {
    const { type } = options || {};
    if (type && type === 'checkbox') {
      this.setValues();
    }
    return undefined;
  }

  @bind
  private handleInputFocusout(options: Partial<{ type: string }>): void {
    const { type } = options || {};
    if (type && type !== 'checkbox') {
      this.setValues();
    }
    return undefined;
  }

  private setValues(): void {
    const prev = this.slider?.getProps();
    const next = this.panel?.getValues();
    if (checkedIsEqual({ prev, next })) {
      this.values = prev;
    } else {
      this.slider?.setProps(next);
      this.values = this.slider?.getProps();
    }
    this.panel?.setValues(this.values);
    return undefined;
  }

  @bind
  private onAfterChange(next?: number[]): void {
    if (!next || !this.values) {
      return undefined;
    }
    const { values: prev } = this.values || {};
    if (isEqual(prev, next)) {
      return undefined;
    }
    const values = $.extend(true, {}, this.values);
    set(values, ['values'], [...next]);
    this.values = values;
    this.panel?.setValues(values);
    return undefined;
  }
}

export default Example;
