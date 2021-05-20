import PubSub from '../../Pubsub';
import { ISubView } from '../../interfaces';
import { DefaultProps, Addition } from '../../types';
export default class MarksView extends PubSub implements ISubView {
    private props?;
    private view?;
    private addition;
    private marks;
    private isRendered;
    private parent?;
    constructor(addition: Addition);
    setProps(props: DefaultProps): void;
    render(parent?: JQuery<HTMLElement>): void;
    remove(): void;
    private static cleanSubView;
    getAddition(): Addition;
    setAddition(addition: Addition): void;
    private createView;
    private prepareAttr;
    private prepareClassName;
    private prepareStyle;
    private updateView;
    private createOrUpdateSubViews;
    private createOrUpdateSubView;
    private appendSubViews;
    private appendSubView;
}
