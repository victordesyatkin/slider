import PubSub from '../../Pubsub';
import { ISubView } from '../../interfaces';
import { DefaultProps, Addition } from '../../types';
declare class MarkView extends PubSub implements ISubView {
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
    private prepareContent;
    private handleViewClick;
    private initHandles;
    private updateView;
}
export default MarkView;
