import { defaultProps } from '../../helpers/utils';
import Model from '../../slider/model';
import View from '../../slider/view';
import Presenter from '../../slider/presenter';
import { DefaultPropsView } from '../../types';

describe('slider', () => {
  describe('presenter', () => {
    test('new presenter', () => {
      const model = new Model(defaultProps);
      const view = new View();
      const presenter = new Presenter(model, view);
      expect(presenter).toBeInstanceOf(Presenter);
    });

    test('initHandlesView, initHandlesModel, setPropsForView, onBeforeChange', () => {
      const model = new Model(defaultProps);
      const view = new View();
      const presenter = new Presenter(model, view);
      const setPropsForView = jest.fn((options?: DefaultPropsView): void => {});
      model.subscribe('setPropsForView', setPropsForView);
      view.publish('onBeforeChange', { index: 5 });
      expect(setPropsForView.mock.calls.length).toBe(1);
      expect(setPropsForView.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          currentHandleIndex: 5,
        })
      );
    });

    test('onAfterChange', () => {
      const onAfterChange = jest.fn((values: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        values: [10, 20],
        onAfterChange: onAfterChange,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      view.publish('onAfterChange');
      expect(onAfterChange.mock.calls.length).toBe(1);
      expect(onAfterChange.mock.calls[0][0]).toStrictEqual([10, 20]);
    });

    test('onChange', () => {
      const onChange = jest.fn((value: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        onChange,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      const options = {
        start: 0,
        length: 100,
        coordinateX: 20,
        coordinateY: 100,
      };
      view.publish('onChange', options);
      expect(onChange.mock.calls.length).toBe(0);
      view.publish('onBeforeChange', { index: 0 });
      view.publish('onChange', options);
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([20]);
    });

    test('getProps', () => {
      const model = new Model({
        ...defaultProps,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      expect(defaultProps).toStrictEqual(presenter.getProps());
    });
    test('setProps', () => {
      const model = new Model({
        ...defaultProps,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      const props = { ...defaultProps, values: [5] };
      presenter.setProps(props);
      expect(props).toStrictEqual(presenter.getProps());
    });
  });
});
