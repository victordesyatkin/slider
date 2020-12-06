import noop from "lodash/noop";
import sortBy from "lodash/sortBy";
import { tDefaultProps, tProps } from "../types";
import { IModel } from "./interface";

export default class Model implements IModel {
  private props: tDefaultProps;
  private callbacks: ((props: tDefaultProps) => void)[] = [];

  constructor(p: tProps) {
    this.props = { ...this.defaultProps, ...p };
    this.prepareValues(this.props);
  }

  public getProps = (): tDefaultProps => {
    return this.props;
  };

  public setProps = (p: tProps): void => {
    p.mark = { ...this.props.mark, ...p.mark };
    p.tooltip = { ...this.props.tooltip, ...p.tooltip };
    this.props = { ...this.props, ...p };
    this.prepareValues(this.props);
    this.callbacks.forEach((callback) => callback(this.props));
  };

  public prepareValues = (props: tDefaultProps): void => {
    const { values, min, max } = props;
    const v = [...values];
    for (const i in v) {
      if (!(v[i] >= min && v[i] <= max)) {
        v[i] = min;
      }
    }
    props.values = sortBy(v);
  };

  public subscribe = (callback: () => tDefaultProps): (() => void) => {
    this.callbacks.push(callback);
    return () =>
      (this.callbacks = this.callbacks.filter((cb) => cb !== callback));
  };
}
