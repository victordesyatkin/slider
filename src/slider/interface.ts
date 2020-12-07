import { tAddition, tDefaultProps, tProps } from "../types";

export interface IModel {
  getProps(): tDefaultProps;
  setProps(p: tProps): void;
}

export interface IView {
  setProps(props: tDefaultProps): void;
  render(parent: JQuery<HTMLElement>): void;
  remove(): void;
}
export interface ISubView extends IView {
  getAddition(): tAddition;
}

export interface IPresenter {
  onChange(values: number[]): void;
  render(parent: JQuery<HTMLElement>): void;
}
