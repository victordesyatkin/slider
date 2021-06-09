import { ComponentProps, ExampleProps } from '../../modules/types';
import Component from '../../helpers';
declare class Example extends Component<ExampleProps> {
    constructor(options: ComponentProps);
    className: string;
    query: string;
    init(): void;
    private panel?;
    private slider?;
    private values?;
    private handleInputFocusout;
    private setValues;
    private onAfterChange;
}
export default Example;
