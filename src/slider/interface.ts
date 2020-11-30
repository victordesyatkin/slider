import { ITrackPresenter } from "../track/interface";
import { IHandlePresenter } from "../handle/interface";
import { IDotsPresenter } from "../dots/interface";
import { IMarksPresenter } from "../marks/interface";

type tooltip = {
  render?: (value: number) => string;
  classNames?: string[];
  active?: boolean;
  precision?: number;
  show?: boolean;
};
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
  tabIndex?: number[];
  startPoint?: number;
  dots?: boolean;
  dotStyle?: { [key: string]: string };
  activeDotStyle?: { [key: string]: string }; // TODO
  railStyle?: { [key: string]: string };
  allowCross?: boolean;
  tooltip?: tooltip;
  pushable?: number;
  precision?: number;

  //TODO
  ariaLabelForHandle?: string;
  ariaLabelledByForHandle?: string;
  ariaValueTextFormatterForHandle?: string;
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
  step?: number;
  marks?: object;
  onChange: (value: number[]) => void;
  onBeforeChange: (value: number[]) => void;
  onAfterChange: (value: number[]) => void;
  dots: boolean;
  railStyle: { [key: string]: string };
  dotStyle: { [key: string]: string };
  activeDotStyle: { [key: string]: string };
  pushable?: number;
  precision?: number;
}
export interface ISliderModelProps extends ISliderDefaultProps {
  value: number[];
  defaultValue: number[];
  count: number;
  sliderClassName: string;
  children?: (
    | ITrackPresenter
    | IHandlePresenter
    | IDotsPresenter
    | IMarksPresenter
  )[];
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
  step?: number;
  marks?: object;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  dots: boolean;
  railStyle: { [key: string]: string };
  dotStyle: { [key: string]: string };
  activeDotStyle: { [key: string]: string }; // TODO

  value: number;
  defaultValue: number;
  index: number;
  trackStyle: { [key: string]: string } | undefined;
  handleStyle: { [key: string]: string } | undefined;
  startPoint?: number;
  tabIndex?: number;
  count: number;
  tooltip?: tooltip;
  pushable?: number;
  precision?: number;
}

export interface ISliderModel {
  getProps(): ISliderModelProps;
  setProps(_props: ISliderModelProps): void;
  getSliderClassName(): string;
  getChildren():
    | (ITrackPresenter | IHandlePresenter | IDotsPresenter | IMarksPresenter)[]
    | undefined;
}

export interface ISliderView {
  updateSliderView(): void;
  get$SliderView(): JQuery<HTMLElement>;
  html(): string;
}

export interface ISliderPresenter {
  html(): string;
  render(parent: JQuery<HTMLElement>): void;
  update(props: ISliderProps | undefined): void;
}
