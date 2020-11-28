import { IDotPresenter } from "../dot/interface";
export interface IDotsProps {
  prefixCls: string;
  vertical: boolean;
  reverse: boolean;
  dots?: boolean;
  dotStyle?: { [key: string]: string };
  activeDotStyle: { [key: string]: string };
  min: number;
  max: number;
  step: number;
}

export interface IDotsModelProps extends IDotsProps {
  prefixCls: string;
  vertical: boolean;
  reverse: boolean;
  dots?: boolean;
  dotStyle?: { [key: string]: string };
  activeDotStyle: { [key: string]: string };
  min: number;
  max: number;
  step: number;
  className: string;
  dotPresenters: IDotPresenter[] | undefined;
}

export interface IDotsModel {
  getProps(): IDotsModelProps;
  setProps(props: IDotsModelProps): void;
}

export interface IDotsView {
  get$View(): JQuery<HTMLElement>;
  getModel(): IDotsModel;
  html(): string;
  updateModel(model: IDotsModel): void;
}

export interface IDotsPresenter {
  getModel(): IDotsModel;
  setModel(model: IDotsModel): void;
  updateModel(props: IDotsProps): void;
  getView(): IDotsView;
  setView(view: IDotsView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
}
