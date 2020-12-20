import { Addition, DefaultProps, Props } from "../types";
import { IPubSub } from "../helpers/interface";

export interface IModel extends IPubSub {
  getProps(): DefaultProps;
  setProps(p: Props): void;
}

export interface IView extends IPubSub {
  setProps(props: DefaultProps): void;
  render(parent: JQuery<HTMLElement>): void;
  remove(): void;
}
export interface ISubView extends IView {
  createView(): void;
  prepareAttr(): {
    class: string | undefined;
    style: string | undefined;
  };
  prepareStyle(): string | undefined;
  updateView(): void;
  onClick(e: any): void;
  onHandlers(): void;
  setProps(props: DefaultProps): void;
  render(parent?: JQuery<HTMLElement>): void;
  remove(): void;
  getAddition(): Addition;
  setAddition(addition: Addition): void;
  prepareClassName(): string;
  getAddition(): Addition;
  setAddition(addition: Addition): void;
}

export interface IPresenter {}
