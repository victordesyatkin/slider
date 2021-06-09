import Component from '../../helpers';
import { ButtonProps, ComponentProps } from '../../modules/types';
declare class Button extends Component<ButtonProps> {
    constructor(options: ComponentProps);
    className: string;
    query: string;
    init(): void;
    enabled(): void;
    disabled(): void;
    private bindEventListeners;
}
export default Button;
