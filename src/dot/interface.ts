export interface IDotProps {
  prefixCls: string;
  vertical: boolean;
  reverse: boolean;
  offset: number;
  dotStyle?: { [key: string]: string };
}

export interface IDotPropsModel {
  className: string;
  style: { [key: string]: string };
}

export interface IDotModel {
  getProps(): IDotPropsModel;
  setProps(props: IDotPropsModel): void;
}

export interface IDotView {
  get$View(): JQuery<HTMLElement>;
  getModel(): IDotModel;
  html(): string;
  updateModel(model: IDotModel): void;
}

export interface IDotPresenter {
  preparePropsForDotModel(props: IDotProps): IDotPropsModel;
  getModel(): IDotModel;
  setModel(model: IDotModel): void;
  updateModel(props: IDotProps): void;
  getView(): IDotView;
  setView(view: IDotView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
}
