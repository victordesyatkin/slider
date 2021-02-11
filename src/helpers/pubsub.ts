import { Callback } from "../types";
import { IPubSub } from "./interface";

class PubSub implements IPubSub {
  private subscribers: { [key: string]: Callback[] } = {};

  public subscribe(
    eventName?: string,
    callback?: Callback
  ): (() => void) | undefined {
    if (!eventName || !callback) {
      return;
    }
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    const index = this.subscribers[eventName].push(callback) - 1;
    return () => this.subscribers[eventName].splice(index, 1);
  }

  public unsubscribe(eventName?: string): void {
    if (eventName && this.subscribers[eventName]) {
      delete this.subscribers[eventName];
    }
  }

  public publish(eventName?: string, data?: any): void {
    if (!eventName || !this.subscribers[eventName]) {
      return;
    }
    this.subscribers[eventName].forEach((callback) => callback(data));
  }
}

export default PubSub;
