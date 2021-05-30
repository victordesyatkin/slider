import { Props, DefaultProps, KeyDefaultProps } from '../types';
declare class Slider {
    static PLUGIN_NAME: string;
    private presenter;
    static createSlider($element: JQuery<HTMLElement>, props?: Props): JQuery;
    constructor(element: JQuery<HTMLElement>, props?: Props);
    unsubscribeAll(): void;
    unsubscribe(action?: string): void;
    getProps(): DefaultProps;
    setProps(props?: Props): void;
    pickProps<T extends KeyDefaultProps>(keys: T[]): Partial<DefaultProps>;
}
export default Slider;
