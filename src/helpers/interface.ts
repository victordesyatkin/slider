import { Callback } from "../types";

export interface IPubSub {
  subscribe(eventName?: string, cb?: Callback): (() => void) | undefined;
  unsubscribe(eventName?: string): void;
  publish(eventName?: string, data?: any): void;
}
