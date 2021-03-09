import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import merge from 'lodash/merge';
// import bind from 'bind-decorator';

import PubSub from '../helpers/pubsub';
import { prepareData, getPosition, calcValueByPos } from '../helpers/utils';
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
    this.props = prepareData(props, this.getProps());
    this.publish(
      'setPropsForView',
      merge({}, this.props, { currentHandleIndex: this.currentHandleIndex })
    );
  }

  public onChange(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    length: number;
  }): void {
    const { disabled, vertical } = this.props;
    if (disabled || isUndefined(this.currentHandleIndex)) {
      return;
    }
    const { coordinateX, coordinateY, start, length } = options;
    const position: number = getPosition({
      vertical,
      coordinateX,
      coordinateY,
    });
    const index = this.currentHandleIndex;
    const { values: previousValues } = this.props;
    const previousValue = previousValues[index];
    const nextValue = calcValueByPos({
      position,
      start,
      length,
      props: this.props,
      index,
    });
    if (previousValue !== nextValue) {
      const nextValues = [...previousValues];
      nextValues[index] = nextValue;
      this.setProps(merge({}, this.props, { values: nextValues }));
      // eslint-disable-next-line prettier/prettier
      const onChange: ((values: number[]) => void) | undefined = this.props
        ?.onChange;
      if (nextValues && onChange) {
        onChange(nextValues);
      }
    }
  }

  public onBeforeChange({ index }: { index: number }): void {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.currentHandleIndex = index;
    this.setProps();
    const { values } = this.props;
    // eslint-disable-next-line prettier/prettier
    const onBeforeChange: ((values: number[]) => void) | undefined = this.props
      ?.onBeforeChange;
    if (values && onBeforeChange) {
      onBeforeChange(values);
    }
  }

  public onAfterChange(): void {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    const { values } = this.props;
    // eslint-disable-next-line prettier/prettier
    const onAfterChange: ((values: number[]) => void) | undefined = this.props
      ?.onAfterChange;
    if (values && onAfterChange) {
      onAfterChange(values);
    }
  }
}

export default Model;
