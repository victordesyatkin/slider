import PubSub from '../../helpers/pubsub';
import { ISubView } from '../../slider/interface';
import { DefaultProps, Addition } from '../../types';
export default class DotsView extends PubSub implements ISubView {
    private props?;
    private view?;
    private addition;
    private dots;
    private parent?;
    private isRendered;
    constructor(addition: Addition);
    render(parent?: JQuery<HTMLElement>): void;
    setProps(props: DefaultProps): void;
    remove(): void;
    getAddition(): Addition;
    setAddition(addition: Addition): void;
    private static cleanSubView;
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
