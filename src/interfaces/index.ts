import { Addition, DefaultProps, Props, Callback } from '../types';

interface IPubSub {
  subscribe(eventName?: string, callback?: Callback): (() => void) | undefined;
  unsubscribe(eventName?: string): void;
  publish(eventName?: string, data?: any): void;
}

interface IModel extends IPubSub {
  getProps(): DefaultProps;
  setProps(props?: Props): void;
  onBeforeChange({ index }: { index: number }): void;
  onAfterChange(): void;
  onChange(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    length: number;
    action?: string;
  }): void;
  setIndex(options: { index?: number }): void;
  unsubscribeAllActions: () => void;
  unsubscribeAction: (action?: string) => void;
}

interface IView extends IPubSub {
  setProps(props: DefaultProps): void;
  render(parent: JQuery<HTMLElement>): void;
  remove(): void;
}

interface ISubView extends IView {
  getAddition(): Addition;
  setAddition(addition: Addition): void;
}

interface IPresenter {
  getProps(): DefaultProps;
  setProps(props?: Props): void;
  unsubscribeAll: () => void;
  unsubscribe: (action?: string) => void;
}

export { IPresenter, ISubView, IView, IModel, IPubSub };
