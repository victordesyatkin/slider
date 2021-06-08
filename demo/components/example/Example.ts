import $ from 'jquery';
import bind from 'bind-decorator';
import set from 'lodash.set';
import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';
import trim from 'lodash.trim';
import isUndefined from 'lodash.isundefined';
import isString from 'lodash.isstring';
import merge from 'lodash.merge';
import orderBy from 'lodash.orderby';
import isEqual from 'lodash.isequal';

import { uniqId, ensureValueInRange } from '../../../src/helpers/utils';
import { Style, Render, Props, KeyProps } from '../../../src/types';
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
      props: { ...panel, handlePanelFocusout: this.handlePanelFocusout },
    });
    this.values = this.panel.getValues();
    this.slider = new Slider({
      parent: this.$element,
      props: { ...this.values, onAfterChange: this.onAfterChange },
    });
    this.setValues();
    // this.bindEventListeners();
    // this.initCache();
    // this.updateProps();
  }

  private panel?: Panel | null;

  private slider?: Slider | null;

  private values?: Props | null;

  @bind
  private handlePanelFocusout(): void {
    console.log('handlePanelFocusout : ');
    this.setValues();
    return undefined;
  }

  private setValues(): void {
    const prev = this.slider?.getProps();
    const next = this.panel?.getValues();
    console.log('setProps : ', next);
    if (checkedIsEqual({ prev, next })) {
      return undefined;
    }
    this.slider?.setProps(next);
    this.values = this.slider?.getProps();
    console.log('getProps : ', this.values);
    this.panel?.setValues(this.values);
    return undefined;
  }

  @bind
  private onAfterChange(next?: number[]): void {
    if (!next || !this.values) {
      return undefined;
    }
    const { values: prev } = this.values || {};
    // console.log('onAfterChange next : ', next);
    // console.log('onAfterChange prev : ', prev);
    // console.log('onAfterChange isEqual : ', isEqual(prev, next));
    if (isEqual(prev, next)) {
      return undefined;
    }
    const values = merge({}, this.values);
    set(values, ['values'], next);
    this.panel?.setValues(values);
    return undefined;
  }
}

export default Example;
