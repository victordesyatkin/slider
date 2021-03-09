import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import merge from 'lodash/merge';
// import bind from 'bind-decorator';

import PubSub from '../helpers/pubsub';
import {
  prepareData,
  calcValueWithEnsure,
  getMousePosition,
  calcValueByPos,
} from '../helpers/utils';
import { IModel } from './interface';
import { DefaultProps, Props } from '../types';

class Model extends PubSub implements IModel {
  private props: DefaultProps;

  private currentHandleIndex?: number;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
  }

  public getProps(): DefaultProps {
    return this.props;
  }

  public setProps(props?: Props): void {
    // console.log('Model setProps props : ', props);
    this.props = prepareData(props, this.getProps());
    this.publish('setPropsForView', this.props);
  }

  public handleViewClick({
    index,
    event,
    value,
    length,
    start,
  }: {
    index: number;
    event: MouseEvent;
    value?: number;
    length: number;
    start: number;
  }): void {
    const disabled = get(this.props, ['disabled']);
    if (disabled) {
      return;
    }
    let newValue: number;
    if (!isUndefined(value)) {
      if (this.props.values.length === 1) {
        newValue = value;
      } else if (
        !isUndefined(this.currentHandleIndex) &&
        this.props.values.length > 1
      ) {
        newValue = calcValueWithEnsure({
          value,
          props: this.props,
          index: this.currentHandleIndex,
        });
      } else {
        return;
      }
    } else {
      const vertical = get(this.props, ['vertical'], false);
      const position = getMousePosition(vertical, event);
      newValue = calcValueByPos({
        position,
        start,
        length,
        props: this.props,
        index: this.currentHandleIndex || index,
      });
    }
    let values: number[] | undefined;
    if (this.props.values.length === 1 && this.props.values[0] !== newValue) {
      values = [newValue];
    } else if (
      this.isUpdateProps(newValue) &&
      !isUndefined(this.currentHandleIndex)
    ) {
      values = [...this.props.values];
      values[this.currentHandleIndex] = newValue;
    }
    if (values) {
      this.setProps(merge({}, this.props, { values }));
      this.handleWindowMouseUp();
    }
  }

  public handleViewMouseDown({ index }: { index: number }): void {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.currentHandleIndex = index;
    this.publish(
      'setPropsForView',
      merge({}, this.props, { currentHandleIndex: this.currentHandleIndex })
    );
    const { values } = this.props;
    const handleModelBeforeChange:
      | ((values: number[]) => void)
      | undefined = get(this.props, ['onBeforeChange']);
    if (handleModelBeforeChange) {
      handleModelBeforeChange(values);
    }
  }

  public handleWindowMouseUp(): void {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    const { values } = this.props;
    const handleModelAfterChange:
      | ((values: number[]) => void)
      | undefined = get(this.props, ['onAfterChange']);
    if (handleModelAfterChange) {
      handleModelAfterChange(values);
    }
  }

  public handleWindowMouseMove(options: {
    event: MouseEvent;
    start: number;
    length: number;
  }): void {
    const { event, start, length } = options;
    const { disabled } = this.props;
    if (!disabled && !isUndefined(this.currentHandleIndex)) {
      const index = this.currentHandleIndex;
      const { vertical, values: prevValues } = this.props;
      const prevValue = prevValues[index];

      const position = getMousePosition(vertical, event);
      const nextValue = calcValueByPos({
        position,
        start,
        length,
        props: this.props,
        index,
      });
      if (prevValue !== nextValue) {
        const nextValues = [...prevValues];
        nextValues[index] = nextValue;
        this.setProps(merge({}, this.props, { values: nextValues }));
        this.handleModelChange(nextValues);
      }
    }
  }

  private handleModelChange(values?: number[]): void {
    const handleModelChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ['onChange']
    );
    if (values && handleModelChange) {
      handleModelChange(values);
    }
  }

  private isUpdateProps(newValue: number): boolean {
    return (
      this.props.values.length > 1 &&
      !isUndefined(this.currentHandleIndex) &&
      this.props.values[this.currentHandleIndex] !== newValue
    );
  }
}

export default Model;
