import { IPubSub } from "../helpers/interface";

import { Addition, DefaultProps, Props } from "../types";

interface IModel extends IPubSub {
  getProps(): DefaultProps;
  setProps(p: Props): void;
}

interface IView extends IPubSub {
  setProps(props: DefaultProps): void;
  render(parent: JQuery<HTMLElement>): void;
  remove(): void;
}
interface ISubView extends IView {
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

interface IPresenter {}

export { IPresenter, ISubView, IView, IModel };
