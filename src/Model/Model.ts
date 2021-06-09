import $ from 'jquery';
import orderBy from 'lodash.orderby';
import isString from 'lodash.isstring';

import PubSub from '../Pubsub';
import {
  prepareData,
  getPosition,
  calcValueByPos,
  getCorrectIndex,
  defaultProps,
} from '../helpers/utils';
import { IModel } from '../interfaces';
import { DefaultProps, Props } from '../types';

class Model extends PubSub implements IModel {
  private static actions = ['onChange', 'onBeforeChange', 'onAfterChange'];

  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = prepareData(props);
  }

  public unsubscribeAllActions(): void {
    const actions: Record<string, null> = {};
    Model.actions.forEach((action) => {
      actions[action] = null;
    });
    this.setProps($.extend(true, {}, { ...this.getProps(), ...actions }));
  }

  public unsubscribeAction(action?: string): void {
    if (isString(action) && Model.actions.indexOf(action) !== -1) {
      this.setProps($.extend(true, {}, { ...this.getProps(), [action]: null }));
    }
  }

  public getProps(): DefaultProps {
    return $.extend(true, {}, this.props);
  }

  public setProps(props?: Props): void {
    const prev = this.getProps();
    const { disabled: disabledPrev } = prev;
    const { disabled: disabledNext } = props || {};
    if (disabledPrev && disabledPrev === disabledNext) {
      return undefined;
    }
    const combineProps = $.extend(
      true,
      {},
      { ...defaultProps, ...prev, ...props }
    );

    this.props = prepareData(combineProps);
    this.publish('setPropsForView', this.props);
    return undefined;
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
        $.extend({}, this.props, { values: nextValues, index: readyIndex })
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
          onAction([...nextValues]);
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
    const onBeforeChange: ((values: number[]) => void) | undefined | null = this
      .props?.onBeforeChange;
    if (values && onBeforeChange) {
      onBeforeChange([...values]);
    }
  }

  public onAfterChange(): void {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.setProps(this.getProps());
    const { values } = this.props;
    const onAfterChange: ((values: number[]) => void) | undefined | null = this
      .props?.onAfterChange;
    if (values && onAfterChange) {
      onAfterChange([...values]);
    }
  }

  public setIndex({ index }: { index?: number }): void {
    const { index: previousIndex, disabled } = this.props;
    if (disabled) {
      return;
    }
    if (previousIndex !== index) {
      const props = $.extend({}, this.props, { index });
      this.setProps(props);
    }
  }
}

export default Model;
