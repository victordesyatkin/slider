import { tAddition, tDefaultProps, tProps } from "../types";

export interface IModel {
  getProps(): tDefaultProps;
  setProps(p: tProps): void;
}

export interface IView {
  setModel(model: IModel): void;
  render(): JQuery<HTMLElement>;
  remove(): void;
}
export interface ISubView extends IView {
  getAddition(): tAddition;
}

export interface IPresenter {
  onChange(values: number[]): void;
}
