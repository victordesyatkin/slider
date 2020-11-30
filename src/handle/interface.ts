import { ITooltipPresenter } from "../tooltip/interface";

export interface IHandleProps {
  prefixCls: string;
  className: string;
  vertical: boolean;
  reverse: boolean;
  offset: number;
  style: { [key: string]: string } | undefined;
  disabled: boolean;
  min: number;
  max: number;
  value: number;
  tabIndex?: number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaValueTextFormatter?: (val: number) => string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  index: number;
  focus?: boolean;
  focused?: boolean;
  tooltip?: {
    render?: (value: number) => string;
    classNames?: string[];
    active?: boolean;
    precision?: number;
    show?: boolean;
  };
}

export interface IHandlePropsModel extends IHandleProps {
  prefixCls: string;
  className: string;
  elStyle: { [key: string]: string };
  tooltipPresenter?: ITooltipPresenter;
  handleBlur: () => void;
  handleFocus: () => void;
  handleKeyUp: () => void;
  handleKeyDown: () => void;
  handleMouseUp: () => void;
  handleMouseDown: () => void;
}

export interface IHandleModel {
  getProps(): IHandlePropsModel;
  setProps(props: IHandlePropsModel): void;
}

export interface IHandleView {
  get$View(): JQuery<HTMLElement>;
  getModel(): IHandleModel;
  html(): string;
  updateModel(model: IHandleModel): void;
  destroy(): void;
}

export interface IHandlePresenter {
  getModel(): IHandleModel;
  setModel(model: IHandleModel): void;
  updateModel(props: IHandleProps): void;
  getView(): IHandleView;
  setView(view: IHandleView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
  destroy(): void;
}
