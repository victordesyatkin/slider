export interface ISliderProps {
  prefixCls?: string;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  included?: boolean;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  className?: string;
  marks?: object;

  step?: number;
  onChange?: (value: number) => void;
  onBeforeChange?: (value: number) => void;
  onAfterChange?: (value: number) => void;

  trackStyle?: { [key: string]: string };
  handleStyle?: { [key: string]: string }[];
  tabIndex?: number;
  ariaLabelForHandle?: string;
  ariaLabelledByForHandle?: string;
  ariaValueTextFormatterForHandle?: string;
  startPoint?: number;
  dots?: boolean;
  railStyle?: { [key: string]: string };
  dotStyle?: { [key: string]: string };
  activeDotStyle?: { [key: string]: string };
}
export interface ISliderDefaultProps extends ISliderProps {
  prefixCls: string;
  className: string;
  vertical: boolean;
  reverse: boolean;
  trackStyle: { [key: string]: string };
  handleStyle: { [key: string]: string }[];
  disabled: boolean;
  included: boolean;
  min: number;
  max: number;
  step: number;
  marks: object;
  onChange: (value: number) => void;
  onBeforeChange: (value: number) => void;
  onAfterChange: (value: number) => void;
  dots: boolean;
  railStyle: { [key: string]: string };
  dotStyle: { [key: string]: string };
  activeDotStyle: { [key: string]: string };
}
export interface ISliderModelProps extends ISliderDefaultProps {
  value: number;
  defaultValue: number;
}

export interface ISliderModel {
  getProps(): ISliderModelProps;
  setProps(_props: ISliderModelProps): void;
  getSliderClassName(): string;
}

export interface ISliderView {
  render(): string;
}

export interface ISliderPresenter {
  render(): string;
  preparePropsForSliderModel(props: ISliderModelProps): ISliderModelProps;
}
