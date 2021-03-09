import { IPubSub } from '../helpers/interface';
import { Addition, DefaultProps, Props } from '../types';

interface IModel extends IPubSub {
  getProps(): DefaultProps;
  setProps(props?: Props): void;
  handleViewClick({
    index,
    event,
    value,
    length,
    start,
  }: {
    index: number;
    event: MouseEvent;
    value?: number;
    length: number;
    start: number;
  }): void;
  handleViewMouseDown({ index }: { index: number }): void;
  handleWindowMouseUp(): void;
  handleWindowMouseMove(options: {
    event: MouseEvent;
    start: number;
    length: number;
  }): void;
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
}

export { IPresenter, ISubView, IView, IModel };
