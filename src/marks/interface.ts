import { IMarkPresenter } from "../mark/interface";

export interface IMarksProps {
  prefixCls?: string;
  className?: string;
  step: number;
  min: number;
  max: number;
  onClick?: () => void;
  render?: (value: number) => string;
  style?: { [key: string]: string };
}

export interface IMarksPropsModel extends IMarksProps {
  items?: IMarkPresenter[];
}

export interface IMarksModel {
  getProps(): IMarksPropsModel;
  setProps(props: IMarksPropsModel): void;
}

export interface IMarksView {
  get$View(): JQuery<HTMLElement>;
  getModel(): IMarksModel;
  html(): string;
  updateModel(model: IMarksModel): void;
}

export interface IDotPresenter {
  getModel(): IMarksModel;
  setModel(model: IMarksModel): void;
  updateModel(props: IMarksProps): void;
  getView(): IMarksView;
  setView(view: IMarksView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
}
