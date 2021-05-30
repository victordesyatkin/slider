import merge from 'lodash.merge';
import orderBy from 'lodash.orderby';
import isString from 'lodash.isstring';

import PubSub from '../Pubsub';
import {
  prepareData,
  getPosition,
  calcValueByPos,
  getCorrectIndex,
} from '../helpers/utils';
import { IModel } from '../interfaces';
import { DefaultProps, Props } from '../types';

class Model extends PubSub implements IModel {
  private static ACTIONS = ['onChange', 'onBeforeChange', 'onAfterChange'];

  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
  }

  public unsubscribeAll(): void {
    const actions: Record<string, null> = {};
    Model.ACTIONS.forEach((action) => {
      actions[action] = null;
    });
    this.setProps({ ...this.getProps(), ...actions });
  }

  public unsubscribe(action?: string): void {
    if (isString(action) && Model.ACTIONS.indexOf(action) !== -1) {
      this.setProps({ ...this.getProps(), [action]: null });
    }
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
    action?: string;
  }): void {
    const { disabled, vertical } = this.props;
    if (disabled) {
      return;
    }
    const {
      coordinateX,
      coordinateY,
      start,
      length,
      action = 'onChange',
    } = options;
    const { index } = this.props;
    const { index: readyIndex, isCorrect } = getCorrectIndex({
      index,
      coordinateX,
      coordinateY,
      start,
      length,
      props: this.props,
    });
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
      let nextValues = [...previousValues];
      nextValues[readyIndex] = nextValue;
      nextValues = orderBy(nextValues, [], ['asc']);
      this.setProps(
        merge({}, this.props, { values: nextValues, index: readyIndex })
      );
      if (this.props && action in this.props) {
        let onAction: ((values: number[]) => void) | undefined | null;
        if (action === 'onChange') {
          onAction = this.props?.[action];
        } else if (action === 'onBeforeChange') {
          onAction = this.props?.[action];
        } else if (action === 'onAfterChange') {
          onAction = this.props?.[action];
        }
        if (nextValues && onAction) {
          onAction(nextValues);
        }
      }
    } else if (isCorrect) {
      this.setIndex({ index: readyIndex });
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
