import { Callback } from '../types';
import { IPubSub } from './interface';
declare class PubSub implements IPubSub {
    private subscribers;
    subscribe(eventName?: string, callback?: Callback): (() => void) | undefined;
    unsubscribe(eventName?: string): void;
    publish(eventName?: string, data?: any): void;
}
export default PubSub;
