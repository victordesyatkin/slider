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

    test('initHandles', () => {
      const model = new Model(defaultProps);
      const mockCallback = jest.fn((): void => {});
      model.subscribe('handleWindowMouseUp', mockCallback);
      model.publish('handleWindowMouseUp');
      expect(mockCallback.mock.calls.length).toBe(1);
    });

    test('handleWindowMouseUp', () => {
      const handleModelAfterChange = jest.fn((values?: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        onAfterChange: handleModelAfterChange,
      });
      const handleWindowMouseUp = jest.fn((): void => {});
      model.subscribe('handleWindowMouseUp', handleWindowMouseUp);
      model.publish('handleWindowMouseUp');
      expect(handleWindowMouseUp.mock.calls.length).toBe(1);
      expect(handleModelAfterChange.mock.calls.length).toBe(1);

      model.setProps({ ...defaultProps, disabled: true });
      model.publish('handleWindowMouseUp');
      expect(handleModelAfterChange.mock.calls.length).toBe(1);
    });

    test('handleWindowMouseDown', () => {
      const handleModelBeforeChange = jest.fn((values?: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        onBeforeChange: handleModelBeforeChange,
      });
      const handleWindowMouseDown = jest.fn(
        (options: { index: number }): void => {}
      );
      model.subscribe('handleViewMouseDown', handleWindowMouseDown);
      model.publish('handleViewMouseDown', { index: 0 });
      expect(handleWindowMouseDown.mock.calls.length).toBe(1);
      expect(handleWindowMouseDown.mock.calls[0][0]).toStrictEqual({
        index: 0,
      });
      expect(handleModelBeforeChange.mock.calls.length).toBe(1);
      expect(handleModelBeforeChange.mock.calls[0][0]).toStrictEqual([0]);

      model.setProps({ ...defaultProps, disabled: true });
      model.publish('handleViewMouseDown', { index: 0 });
      expect(handleModelBeforeChange.mock.calls.length).toBe(1);
    });

    test('handleViewClick', () => {
      const model = new Model(defaultProps);
      const handleViewClick = jest.fn(
        (options: {
          index: number;
          event: MouseEvent;
          value?: number;
          length: number;
          start: number;
        }): void => {}
      );
      model.subscribe('handleViewClick', handleViewClick);
      const event = new MouseEvent('click');
      model.publish('handleViewClick', {
        event,
        index: 0,
        value: 0,
        length: 100,
        start: 0,
      });
      expect(handleViewClick.mock.calls.length).toBe(1);
      expect(handleViewClick.mock.calls[0][0]).toStrictEqual({
        event,
        index: 0,
        value: 0,
        length: 100,
        start: 0,
      });
      let props = model.getProps();
      expect(props.values).toStrictEqual([0]);
      model.publish('handleViewClick', {
        event,
        index: 0,
        value: 50,
        length: 100,
        start: 0,
      });
      expect(handleViewClick.mock.calls[1][0]).toStrictEqual({
        event,
        index: 0,
        value: 50,
        length: 100,
        start: 0,
      });

      props = model.getProps();
      expect(props.values).toStrictEqual([50]);

      model.setProps({ ...defaultProps, disabled: true });
      model.publish('handleViewClick', {
        event,
        index: 0,
        value: 10,
        length: 100,
        start: 0,
      });
      props = model.getProps();
      expect(props.values).toStrictEqual([0]);
    });

    test('handleWindowMouseMove', () => {
      const model = new Model(defaultProps);
      const handleWindowMouseMove = jest.fn(
        (options: {
          event: MouseEvent;
          length: number;
          start: number;
        }): void => {}
      );
      model.subscribe('handleWindowMouseMove', handleWindowMouseMove);
      const event = new MouseEvent('mousemove');
      model.publish('handleWindowMouseMove', {
        event,
        length: 100,
        start: 0,
      });
      expect(handleWindowMouseMove.mock.calls.length).toBe(1);
      expect(handleWindowMouseMove.mock.calls[0][0]).toStrictEqual({
        event,
        length: 100,
        start: 0,
      });
    });

    test('handleModelChange', () => {
      const handleModelChange = jest.fn((values: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        onChange: handleModelChange,
        vertical: true,
      });
      const event = new MouseEvent('mousemove', { clientY: 15 });
      model.publish('handleViewMouseDown', { index: 0 });
      model.publish('handleWindowMouseMove', {
        event,
        start: 0,
        length: 100,
      });
      expect(handleModelChange.mock.calls.length).toBe(1);
      expect(handleModelChange.mock.calls[0][0]).toStrictEqual([85]);

      model.setProps({ ...defaultProps, onChange: handleModelChange });
      expect(handleModelChange.mock.calls.length).toBe(1);

      model.setProps({
        ...defaultProps,
        onChange: handleModelChange,
        disabled: true,
      });
      expect(handleModelChange.mock.calls.length).toBe(1);
    });
  });
});
