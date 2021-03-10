import isUndefined from 'lodash/isUndefined';
import merge from 'lodash/merge';

import PubSub from '../helpers/pubsub';
import {
  prepareData,
  getPosition,
  calcValueByPos,
  getNearestIndex,
} from '../helpers/utils';
import { IModel } from './interface';
import { DefaultProps, Props } from '../types';

class Model extends PubSub implements IModel {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
  }

  public getProps(): DefaultProps {
    return this.props;
  }

  public setProps(props?: Props): void {
    this.props = prepareData(props, this.getProps());
    this.publish('setPropsForView', this.props);
  }

  public onChange(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    length: number;
  }): void {
    const { disabled, vertical } = this.props;
    if (disabled) {
      return;
    }
    const { coordinateX, coordinateY, start, length } = options;
    const { index } = this.props;
    let readyIndex = index;
    if (isUndefined(readyIndex) || readyIndex < 0) {
      readyIndex = getNearestIndex({
        coordinateX,
        coordinateY,
        start,
        length,
        props: this.props,
      });
      this.setIndex({ index: readyIndex });
    }
    const position: number = getPosition({
      vertical,
      coordinateX,
      coordinateY,
    });
    const { values: previousValues } = this.props;
    const previousValue = previousValues[readyIndex];
    const nextValue = calcValueByPos({
      position,
      start,
      length,
      props: this.props,
      index: readyIndex,
    });
    if (previousValue !== nextValue) {
      const nextValues = [...previousValues];
      nextValues[readyIndex] = nextValue;
      this.setProps(merge({}, this.props, { values: nextValues }));
      const onChange: ((values: number[]) => void) | undefined = this.props
        ?.onChange;
      if (nextValues && onChange) {
        onChange(nextValues);
      }
    }
  }

  public onBeforeChange({ index }: { index: number | undefined }): void {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.setIndex({ index });
    const { values } = this.props;
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
    this.setProps();
    const { values } = this.props;
    // eslint-disable-next-line prettier/prettier
    const onAfterChange: ((values: number[]) => void) | undefined = this.props
      ?.onAfterChange;
    if (values && onAfterChange) {
      onAfterChange(values);
    }
  }

  public setIndex({ index }: { index?: number }): void {
    const { index: previousIndex, disabled } = this.props;
    if (disabled) {
      return;
    }
    if (previousIndex !== index) {
      const props = merge({}, this.props, { index });
      this.setProps(props);
    }
  }
}

export default Model;
