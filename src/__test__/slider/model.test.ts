import { defaultProps } from "../../slider/index";
import Model from "../../slider/model";
import { DefaultProps } from "../../types";

describe("slider", () => {
  describe("model", () => {
    test("defaultProps -> new model -> model ", () => {
      const model = new Model(defaultProps);
      expect(model).toBeInstanceOf(Model);
      expect(model).toEqual(
        expect.objectContaining({
          getProps: expect.any(Function),
          setProps: expect.any(Function),
        })
      );
    });
    test("{values:[20,80], min: 10,} -> setProps-> getProps -> {values: [20: 80], min: 10}", () => {
      const model = new Model(defaultProps);
      model.setProps({ ...defaultProps, values: [20, 80], min: 10 });
      let props = model.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          values: expect.arrayContaining([80, 20]),
        })
      );
      expect(props.min).toBe(10);
    });
    test('{values: [20: 80], min: 10} -> publish("setPropsModel") -> getProps -> {values: [20: 80], min: 10}', () => {
      const model = new Model(defaultProps);
      model.publish("setPropsModel", {
        ...defaultProps,
        values: [20, 80],
        min: 10,
      });
      let props = model.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          values: expect.arrayContaining([80, 20]),
        })
      );
      expect(props.min).toBe(10);
    });
    test('subscribe("setPropsView") -> publish("setPropsModel") {values: [20: 80], min: 10} -> setPropsView -> {values: [20: 80], min: 10}', () => {
      const model = new Model(defaultProps);
      const mockCallback = jest.fn((data: any): void => {});
      model.subscribe("setPropsView", mockCallback);
      model.publish("setPropsModel", {
        ...defaultProps,
        values: [20, 80],
        min: 10,
      });
      expect(mockCallback.mock.calls.length).toBe(1);
      const props = mockCallback.mock.calls[0][0];
      expect(props).toEqual(
        expect.objectContaining({
          values: expect.arrayContaining([80, 20]),
          min: expect.any(Number),
        })
      );
      expect(props.min).toBe(10);
    });
    test("onBeforeChange model", () => {
      const mockCallback = jest.fn((data: any): void => {});
      let props: DefaultProps = {
        ...defaultProps,
        onBeforeChange: mockCallback,
      };
      const model = new Model(props);
      model.onBeforeChange([10, 20]);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([10, 20]);

      model.onBeforeChange();
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([10, 20]);
    });

    test("onAfterChange model", () => {
      const mockCallback = jest.fn((data: any): void => {});
      let props: DefaultProps = {
        ...defaultProps,
        onAfterChange: mockCallback,
      };
      const model = new Model(props);
      model.onAfterChange([10, 20]);
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([10, 20]);

      model.onAfterChange();
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toStrictEqual([10, 20]);
    });
  });
});
