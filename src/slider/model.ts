import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import merge from "lodash/merge";
import bind from "bind-decorator";

import PubSub from "../helpers/pubsub";
import {
  prepareData,
  calcValueWithEnsure,
  getMousePosition,
  calcValueByPos,
} from "../helpers/utils";
import { IModel } from "../slider/interface";
import { DefaultProps, Props } from "../types";

class Model extends PubSub implements IModel {
  private props: DefaultProps;
  private currentHandleIndex?: number;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.initHandles();
  }

  public getProps(): DefaultProps {
    return this.props;
  }

  public setProps(props: Props): void {
    this.props = prepareData(props, this.getProps());
    this.publish("setPropsView", this.props);
  }

  private initHandles(): void {
    this.subscribe("setPropsModel", this.setPropsForView);
    this.subscribe("handleViewMouseDown", this.handleModelBeforeChange);
    this.subscribe("handleWindowMouseUp", this.handleModelAfterChange);
  }

  private handleModelChange(values?: number[]): void {
    const handleModelChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onChange"]
    );
    values && handleModelChange && handleModelChange(values);
  }

  @bind
  private handleModelBeforeChange({ index }: { index: number }): void {
    const { disabled, values } = this.props;
    if (disabled) {
      return;
    }
    this.currentHandleIndex = index;
    const handleModelBeforeChange:
      | ((values: number[]) => void)
      | undefined = get(this.props, ["onBeforeChange"]);
    values && handleModelBeforeChange && handleModelBeforeChange(values);
  }

  @bind
  private handleModelAfterChange({
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
    const disabled = get(this.props, ["disabled"]);
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
      const vertical = get(this.props, ["vertical"], false);
      const position = getMousePosition(vertical, event as MouseEvent);
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
      this.props.values.length > 1 &&
      !isUndefined(this.currentHandleIndex) &&
      this.props.values[this.currentHandleIndex] !== newValue
    ) {
      values = [...this.props.values];
      values[this.currentHandleIndex] = newValue;
    }
    if (values) {
      this.setProps(merge({}, this.getProps(), { values }));
      const handleModelAfterChange:
        | ((values: number[]) => void)
        | undefined = get(this.props, ["onAfterChange"]);
      values && handleModelAfterChange && handleModelAfterChange(values);
    }
  }

  @bind
  private setPropsForView(props: Props): void {
    this.handleModelChange(get(props, ["values"]));
    this.setProps(props);
  }
}

export default Model;
