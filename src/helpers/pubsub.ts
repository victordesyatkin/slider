import { Callback } from '../types';
import { IPubSub } from './interface';

class PubSub implements IPubSub {
  private subscribers: { [key: string]: Callback[] } = {};

  // eslint-disable-next-line fsd/hof-name-prefix
  public subscribe(
    eventName?: string,
    callback?: Callback
  ): (() => void) | undefined {
    if (!eventName || !callback) {
      return undefined;
    }
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    const index = this.subscribers[eventName].push(callback) - 1;
    const additionalUnsubscribe = () =>
      this.subscribers[eventName].splice(index, 1);
    return additionalUnsubscribe;
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
