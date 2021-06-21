import Component from '../../helpers';
import { ComponentProps, InputProps } from '../../modules/types';
declare class Input extends Component<InputProps> {
    constructor(options?: ComponentProps);
    className: string;
    query: string;
    init(): void;
    setValue(value: unknown): void;
    getValue(): string | number | string[] | undefined;
    private handleInputInput;
    handleInputFocusout(): void;
    private $input?;
}
export default Input;
