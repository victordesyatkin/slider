import PubSub from '../../helpers/pubsub';

describe('helpers', () => {
  describe('pubsub', () => {
    test('create pubsub', () => {
      const pubsub = new PubSub();
      expect(pubsub).toBeInstanceOf(PubSub);
      expect(pubsub).toEqual(
        expect.objectContaining({
          subscribers: {},
        })
      );
    });
    test('pubsub subscribe unsubscribe publish', () => {
      const pubsub = new PubSub();
      const mockCallback = jest.fn((data: any): void => {});
      pubsub.subscribe('mockCallback', mockCallback);
      pubsub.publish('mockCallback', 5);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toBe(5);
      expect(mockCallback.mock.results[0].value).toBe(undefined);
      pubsub.unsubscribe('mockCallback');
      pubsub.publish('mockCallback', 6);
      pubsub.publish('mockCallback', 7);
      pubsub.publish('mockCallback', 'hello');
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(pubsub.subscribe()).toBeUndefined();
    });
  });
});
