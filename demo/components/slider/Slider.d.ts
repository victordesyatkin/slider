import { Props } from '../../../src/types';
import Component from '../../helpers';
import { ComponentProps } from '../../modules/types';
declare class SliderComponent extends Component<Props> {
    constructor(options?: ComponentProps);
    className: string;
    query: string;
    init(): void;
    setProps(props?: Props): void;
    getProps(): Props | undefined;
    private $slider?;
    private slider?;
}
export default SliderComponent;
