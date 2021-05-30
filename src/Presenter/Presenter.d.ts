import { DefaultProps, Props } from '../types';
import { IPresenter } from '../interfaces';
declare class Presenter implements IPresenter {
    private model;
    private view;
    constructor(element: JQuery<HTMLElement>, props?: Props);
    unsubscribeAll(): void;
    unsubscribe(action?: string): void;
    getProps(): DefaultProps;
    setProps(props?: Props): void;
    private initHandlesView;
    private initHandlesModel;
    private onChange;
    private onAfterChange;
    private onBeforeChange;
    private setPropsForView;
    private setIndex;
}
export default Presenter;
