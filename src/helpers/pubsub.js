"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PubSub {
    constructor() {
        this.subscribers = {};
    }
    // eslint-disable-next-line fsd/hof-name-prefix
    subscribe(eventName, callback) {
        if (!eventName || !callback) {
            return undefined;
        }
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }
        const index = this.subscribers[eventName].push(callback) - 1;
        const additionalUnsubscribe = () => this.subscribers[eventName].splice(index, 1);
        return additionalUnsubscribe;
    }
    unsubscribe(eventName) {
        if (eventName && this.subscribers[eventName]) {
            delete this.subscribers[eventName];
        }
    }
    publish(eventName, data) {
        if (!eventName || !this.subscribers[eventName]) {
            return;
        }
        this.subscribers[eventName].forEach((callback) => callback(data));
    }
}
exports.default = PubSub;
//# sourceMappingURL=pubsub.js.map