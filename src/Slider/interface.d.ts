import { IPubSub } from '../helpers/interface';
import { Addition, DefaultProps, Props } from '../types';
interface IModel extends IPubSub {
    getProps(): DefaultProps;
    setProps(props?: Props): void;
    onBeforeChange({ index }: {
        index: number;
    }): void;
    onAfterChange(): void;
    onChange(options: {
        coordinateX: number;
        coordinateY: number;
        start: number;
        length: number;
        action?: string;
    }): void;
    setIndex(options: {
        index?: number;
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
