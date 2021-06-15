import { ValuesProps, ComponentProps } from '../../modules/types';
import Component from '../../helpers';
declare class Values extends Component<ValuesProps> {
    constructor(options: ComponentProps);
    className: string;
    query: string;
    getValue(): number[];
    setValue(value?: unknown): void;
    init(): void;
    private $template?;
    private $content?;
    private $buttonAdd?;
    private buttonAdd?;
    private $buttonRemove?;
    private buttonRemove?;
    private $items?;
    private items;
    private createUl;
    private createLi;
    private createValuesItem;
    private renderUl;
    private handleButtonAddClick;
    private handleButtonRemoveClick;
    handleInputInput(options?: {
        index?: number;
        value?: string;
    }): void;
    private toggleVisibleButtonRemove;
}
export default Values;
