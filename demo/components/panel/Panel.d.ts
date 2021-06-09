import { Props } from '../../../src/types';
import { ComponentProps, PanelProps } from '../../modules/types';
import Component from '../../helpers';
declare class Panel extends Component<PanelProps> {
    constructor(options: ComponentProps);
    className: string;
    query: string;
    init(): void;
    getValues(): Props;
    setValues(values?: Props): void;
    private $sections?;
    private sections?;
    private createSection;
}
export default Panel;
