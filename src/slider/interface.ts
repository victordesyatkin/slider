import { Addition, DefaultProps, Props } from "../types";

export interface IModel {
  getProps(): DefaultProps;
  setProps(p: Props): void;
}

export interface IView {
  setProps(props: DefaultProps): void;
  render(parent: JQuery<HTMLElement>): void;
  remove(): void;
}
export interface ISubView extends IView {
  getAddition(): Addition;
  setAddition(addition: Addition): void;
}

export interface IPresenter {
  render(parent: JQuery<HTMLElement>): void;
}
