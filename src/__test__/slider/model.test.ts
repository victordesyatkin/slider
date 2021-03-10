import { defaultProps } from '../../helpers/utils';
import Model from '../../slider/model';
import { DefaultProps } from '../../types';

describe('slider', () => {
  describe('model', () => {
    test('defaultProps -> new model -> model ', () => {
      const model = new Model(defaultProps);
      expect(model).toBeInstanceOf(Model);
      expect(model).toEqual(
        expect.objectContaining({
          getProps: expect.any(Function),
          setProps: expect.any(Function),
        })
      );
    });

    test('{values:[20,80], min: 10,} -> setProps-> getProps -> {values: [20: 80], min: 10}', () => {
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

    test('onAfterChange', () => {
      const onAfterChange = jest.fn((values?: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        onAfterChange,
      });
      model.onAfterChange();
      expect(onAfterChange.mock.calls.length).toBe(1);

      model.setProps({ ...defaultProps, disabled: true });
      model.onAfterChange();
      expect(onAfterChange.mock.calls.length).toBe(1);
    });

    test('onBeforeChange', () => {
      const onBeforeChange = jest.fn((values?: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        onBeforeChange,
      });
      model.onBeforeChange({ index: 0 });
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([0]);
      model.setProps({ ...defaultProps, disabled: true });
      model.publish('handleViewMouseDown', { index: 0 });
      expect(onBeforeChange.mock.calls.length).toBe(1);
    });

    test('onChange', () => {
      const onChange = jest.fn((values?: number[]): void => {});
      const onBeforeChange = jest.fn((values?: number[]): void => {});
      const model = new Model({ ...defaultProps, onChange, onBeforeChange });
      model.onChange({
        coordinateX: 43,
        coordinateY: 80,
        length: 100,
        start: 0,
        action: 'onChange',
      });
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([43]);
      let values = model.getProps()?.values;
      expect(values).toStrictEqual([43]);
      model.setProps({ ...defaultProps, disabled: true });
      model.onChange({
        coordinateX: 86,
        coordinateY: 80,
        length: 100,
        start: 0,
      });
      values = model.getProps()?.values;
      expect(values).toStrictEqual([0]);
      expect(onChange.mock.calls.length).toBe(1);
      model.setProps({ ...defaultProps, disabled: false });
      model.onChange({
        coordinateX: 86,
        coordinateY: 80,
        length: 100,
        start: 0,
        action: 'onBeforeChange',
      });
      expect(onChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls.length).toBe(1);
      expect(onBeforeChange.mock.calls[0][0]).toStrictEqual([86]);
    });
    test('setIndex', () => {
      const model = new Model({
        ...defaultProps,
      });
      model.setIndex({ index: 7 });
      let index = model.getProps()?.index;
      expect(index).toBe(7);
      model.setIndex({ index: 7 });
      index = model.getProps()?.index;
      model.setIndex({ index: 7 });
      model.setProps({ ...defaultProps, disabled: true });
      model.setIndex({ index: 12 });
      index = model.getProps()?.index;
      expect(index).toBe(7);
    });
  });
});
