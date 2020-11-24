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

  step?: number | null;
  onChange?: (value: number) => void;
  onBeforeChange?: (value: number) => void;
  onAfterChange?: (value: number) => void;

  trackStyle?: { [key: string]: string }[];
  handleStyle?: { [key: string]: string }[];
  tabIndex?: number;
  ariaLabelForHandle?: string;
  ariaLabelledByForHandle?: string;
  ariaValueTextFormatterForHandle?: string;
  startPoint?: number;
}

export interface ISliderModelProps extends ISliderProps {
  className: string;
  marks: object;
}

export interface ISliderModel {
  getProps(): ISliderProps;
  setProps(_props: ISliderProps): void;
}

export interface ISliderView {
  render(): string;
}

export interface ISliderPresenter {
  render(): string;
  preparePropsForSliderModel(props: ISliderModelProps): ISliderModelProps;
}
