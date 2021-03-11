import { ISubView } from '../../slider/interface';
import PubSub from '../../helpers/pubsub';
import { DefaultProps, Addition } from '../../types';
export default class RailView extends PubSub implements ISubView {
    private props?;
    private view?;
    private addition;
    private isRendered;
    private parent?;
    constructor(addition: Addition);
    setProps(props: DefaultProps): void;
    render(parent?: JQuery<HTMLElement>): void;
    remove(): void;
    getAddition(): Addition;
    setAddition(addition: Addition): void;
    private createView;
    private prepareAttr;
    private prepareClassName;
    private prepareStyle;
    private updateView;
    private handleViewClick;
    private initHandles;
}
