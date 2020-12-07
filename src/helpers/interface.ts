import { tpbcallback } from "../types";

export interface IPubSub {
  subscribe(eventName?: string, cb?: tpbcallback): (() => void) | undefined;
  unsubscribe(eventName?: string): void;
  publish(eventName?: string, data?: any): void;
}
