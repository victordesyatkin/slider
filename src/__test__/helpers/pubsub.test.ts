import PubSub from "../../helpers/pubsub";
describe("helpers", () => {
  describe("pubsub", () => {
    test("create pubsub", () => {
      const pubsub = new PubSub();
      expect(pubsub).toBeInstanceOf(PubSub);
      expect(pubsub).toEqual(
        expect.objectContaining({
          subscribers: expect.any(Object),
          unsubscribe: expect.any(Function),
          subscribe: expect.any(Function),
          publish: expect.any(Function),
        })
      );
    });
  });
});
