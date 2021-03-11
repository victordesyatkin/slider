import PubSub from '../../helpers/pubsub';
import { ISubView } from '../../slider/interface';
import { DefaultProps, Addition } from '../../types';
declare class DotView extends PubSub implements ISubView {
    private props?;
    private view?;
    private addition;
    private parent?;
    private isRendered;
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
export default DotView;
