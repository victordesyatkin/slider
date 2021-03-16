import PubSub from '../Pubsub';
import { IModel } from '../interfaces';
import { DefaultProps, Props } from '../types';
declare class Model extends PubSub implements IModel {
    private props;
    constructor(props: DefaultProps);
    getProps(): DefaultProps;
    setProps(props?: Props): void;
    onChange(options: {
        coordinateX: number;
        coordinateY: number;
        start: number;
        length: number;
        action?: string;
    }): void;
    onBeforeChange({ index }: {
        index: number | undefined;
    }): void;
    onAfterChange(): void;
    setIndex({ index }: {
        index?: number;
    }): void;
}
export default Model;
