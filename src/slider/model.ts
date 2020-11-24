import classNames from "classnames";
import { ISliderModelProps } from "./interface";

export default class SliderModel {
  private props: ISliderModelProps;
  private sliderClassName: string;

  constructor(_props: ISliderModelProps) {
    this.props = _props;
    const { prefixCls, marks, disabled, vertical, className } = _props;
    this.sliderClassName = classNames(prefixCls, {
      [`${prefixCls}-with-marks`]: Object.keys(marks).length,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-vertical`]: vertical,
      [className]: className,
    });
  }

  getProps(): ISliderModelProps {
    return this.props;
  }

  setProps(_props: ISliderModelProps): void {
    this.props = _props;
  }

  getSliderClassName(): string {
    return this.sliderClassName;
  }
}
