import { Props } from '../../../src/types';
import { ComponentProps, SectionProps } from '../../modules/types';
import Component from '../../helpers';
declare class Section extends Component<SectionProps> {
    constructor(options: ComponentProps);
    className: string;
    query: string;
    init(): void;
    getValues(): Props | undefined | null;
    setValues(values?: Props): void;
    private createItem;
    private values?;
    private $item;
    private items;
}
export default Section;
