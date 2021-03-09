import { Callback } from '../types';

export interface IPubSub {
  subscribe(eventName?: string, callback?: Callback): (() => void) | undefined;
  unsubscribe(eventName?: string): void;
  publish(eventName?: string, data?: any): void;
}
