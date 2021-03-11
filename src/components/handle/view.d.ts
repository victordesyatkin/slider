import PubSub from '../../helpers/pubsub';
import { ISubView } from '../../slider/interface';
import { DefaultProps, Addition } from '../../types';
export default class HandleView extends PubSub implements ISubView {
    private addition;
    private props?;
    private view?;
    private isRendered;
    private parent?;
    private tooltip?;
    constructor(addition: Addition);
    setProps(props: DefaultProps): void;
    getProps(): DefaultProps | undefined;
    render(parent?: JQuery<HTMLElement>): void;
    remove(): void;
    getAddition(): Addition;
    setAddition(addition: Addition): void;
    private createView;
    private handleViewMouseDown;
    private prepareAttr;
    private prepareClassName;
    private prepareStyle;
    private isProps;
    private appendTooltip;
    private updateView;
    private initHandles;
}
