import { Props, DefaultProps } from '../types';
import { IModel, IView, IPresenter } from '../interfaces';
declare class Presenter implements IPresenter {
    private model;
    private view;
    constructor(model: IModel, view: IView);
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
