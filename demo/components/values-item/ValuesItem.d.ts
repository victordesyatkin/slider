import { ComponentProps, ValueItemProps } from '../../modules/types';
import Component from '../../helpers';
declare class ValueItem extends Component<ValueItemProps> {
    constructor(options: ComponentProps);
    getValue(): string | number | string[] | undefined;
    className: string;
    query: string;
    init(): void;
    private $index?;
    private $input?;
    private input?;
    private $buttonRemove?;
    private buttonRemove?;
    private handleButtonRemoveClick;
    private handleInputInput;
    private handleInputFocusout;
    private setIndex;
}
export default ValueItem;
