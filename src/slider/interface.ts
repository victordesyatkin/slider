export interface ISliderProps {
  prefixCls?: string;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  included?: boolean;
  value?: number[];
  defaultValue?: number[];
  count?: number;
  min?: number;
  max?: number;
  className?: string;
  marks?: object;

  step?: number;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;

  trackStyle?: ({ [key: string]: string } | undefined)[];
  handleStyle?: ({ [key: string]: string } | undefined)[];
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
  trackStyle: ({ [key: string]: string } | undefined)[];
  handleStyle: ({ [key: string]: string } | undefined)[];
  disabled: boolean;
  included: boolean;
  min: number;
  max: number;
  step: number;
  marks: object;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  dots: boolean;
  railStyle: { [key: string]: string };
  dotStyle: { [key: string]: string };
  activeDotStyle: { [key: string]: string };
}
export interface ISliderModelProps extends ISliderDefaultProps {
  value: number[];
  defaultValue: number[];
  count: number;
}

export interface ISliderSingleProps {
  prefixCls: string;
  className: string;
  vertical: boolean;
  reverse: boolean;
  disabled: boolean;
  included: boolean;
  min: number;
  max: number;
  step: number;
  marks: object;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  dots: boolean;
  railStyle: { [key: string]: string };
  dotStyle: { [key: string]: string };
  activeDotStyle: { [key: string]: string };

  value: number;
  defaultValue: number;
  index: number;
  trackStyle: { [key: string]: string } | undefined;
  handleStyle: { [key: string]: string } | undefined;
  startPoint?: number;
  tabIndex?: number;
  count: number;
}

export interface ISliderModel {
  getProps(): ISliderModelProps;
  setProps(_props: ISliderModelProps): void;
  getSliderClassName(): string;
}

export interface ISliderView {
  get$SliderView(): JQuery<HTMLElement>;
  html(): string;
}

export interface ISliderPresenter {
  html(): string;
  get$SliderView(): JQuery<HTMLElement>;
  preparePropsForSliderModel(props: ISliderModelProps): ISliderModelProps;
  updateModel(props: ISliderModelProps): void;
}
