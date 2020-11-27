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
  tabIndex: number;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaValueTextFormatter?: (val: number) => string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  index: number;
}

export interface IHandlePropsModel extends IHandleProps {
  prefixCls: string;
  className: string;
  elStyle: { [key: string]: string };
  handleBlur: () => void;
  handleKeyDown: () => void;
  handleMouseDown: () => void;
}

export interface IHandleModel {
  getProps(): IHandlePropsModel;
  setProps(props: IHandlePropsModel): void;
}

export interface IHandleView {
  createView(): JQuery<HTMLElement>;
  get$View(): JQuery<HTMLElement>;
  getModel(): IHandleModel;
  html(): string;
  updateModel(model: IHandleModel): void;
}

export interface IHandlePresenter {
  preparePropsForHandleModel(props: IHandleProps): IHandlePropsModel;
  prepareElStyle(props: IHandleProps): { [key: string]: string };
  getModel(): IHandleModel;
  setModel(model: IHandleModel): void;
  updateModel(props: IHandleProps): void;
  getView(): IHandleView;
  setView(view: IHandleView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
}
