import noop from "lodash/noop";
import get from "lodash/get";
import classnames from "classnames";
import { tDefaultProps, tProps } from "../types";
import { IModel } from './interface';

export default class Model: IModel {
  private props: tDefaultProps;

  private defaultProps: tDefaultProps = {
    prefixCls: "slider",
    className: "",
    value: [0],
    defaultValue: [0],
    tabIndex: [-1],
    min: 0,
    max: 100,
    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    disabled: false,
    dots: false,
    vertical: false,
    reverse: false,
    allowCross: false,
    precision: 0,
    pushable: false,
  };

  constructor(p: tProps) {
    this.props = { ...this.defaultProps, ...p };
  }

  getProps(): tDefaultProps {
    return this.props;
  }

  setProps(p: tProps): void {
    p.mark = { ...this.props.mark, ...p.mark };
    p.tooltip = { ...this.props.tooltip, ...p.tooltip };
    this.props = { ...this.props, ...p };
  }

  get className(): string {
    const { prefixCls, mark, disabled, vertical, classNames } = this.props;
    return classnames(prefixCls, {
      [`${prefixCls}_with-marks`]: get(mark, ["show"]),
      [`${prefixCls}_disabled`]: disabled,
      [`${prefixCls}_vertical`]: vertical,
      classNames,
    });
  }
}
