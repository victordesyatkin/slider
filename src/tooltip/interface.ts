export interface ITooltipProps {
  prefixCls: string;
  classNames?: string[];
  style?: { [key: string]: string };
  active?: boolean;
  label?: string | undefined;
  render?: (value: number) => string;
  value: number;
  precision?: number;
  show?: boolean;
}

export interface ITooltipPropsModel {
  className: string;
  style?: string | undefined;
  label?: string | undefined;
  show?: boolean;
}

export interface ITooltipModel {
  getProps(): ITooltipPropsModel;
  setProps(props: ITooltipPropsModel): void;
}

export interface ITooltipView {
  get$View(): JQuery<HTMLElement> | string;
  getModel(): ITooltipModel;
  html(): string;
  updateModel(model: ITooltipModel): void;
}

export interface ITooltipPresenter {
  getModel(): ITooltipModel;
  setModel(model: ITooltipModel): void;
  updateModel(props: ITooltipProps): void;
  getView(): ITooltipView;
  setView(view: ITooltipView): void;
  get$View(): JQuery<HTMLElement> | string;
  html(): string;
}
