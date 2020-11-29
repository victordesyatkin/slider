export interface IMarkProps {
  className: string;
  offset: number;
  style?: { [key: string]: string };
  label: string;
  onClick: (e: any, value: number) => void;
  _onClick?: (e: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  vertical?: boolean;
  reverse?: boolean;
  focus?: boolean;
  value: number;
}

export interface IMarkPropsModal extends IMarkProps {
  style: { [key: string]: string };
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
