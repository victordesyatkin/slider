export interface IMarkProps {
  className: string;
  offset?: number;
  style?: { [key: string]: string };
  label?: string;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  render?: (value: number) => string;
  focus?: boolean;
}

export interface IMarkModel {
  getProps(): IMarkProps;
  setProps(props: IMarkProps): void;
}

export interface IMarkView {
  get$View(): JQuery<HTMLElement>;
  getModel(): IMarkModel;
  html(): string;
  updateModel(model: IMarkModel): void;
}

export interface IMarkPresenter {
  getModel(): IMarkModel;
  setModel(model: IMarkModel): void;
  updateModel(props: IMarkProps): void;
  getView(): IMarkView;
  setView(view: IMarkView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
}
