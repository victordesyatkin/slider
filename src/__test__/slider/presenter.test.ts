import $ from 'jquery';

import { defaultProps } from '../../slider/index';
import Model from '../../slider/model';
import View from '../../slider/view';
import Presenter from '../../slider/presenter';
import { DefaultPropsView, DefaultProps } from '../../types';

describe('slider', () => {
  describe('presenter', () => {
    test('new presenter', () => {
      const model = new Model(defaultProps);
      const view = new View();
      const presenter = new Presenter(model, view);
      expect(presenter).toBeInstanceOf(Presenter);
    });

    test('initHandlesView, initHandlesModel, setPropsForView, handleViewMouseDown', () => {
      const model = new Model(defaultProps);
      const view = new View();
      const presenter = new Presenter(model, view);
      const setPropsForView = jest.fn((options?: DefaultPropsView): void => {});
      model.subscribe('setPropsForView', setPropsForView);
      view.publish('handleViewMouseDown', { index: 5 });
      expect(setPropsForView.mock.calls.length).toBe(1);
      expect(setPropsForView.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          currentHandleIndex: 5,
        })
      );
    });

    test('handleWindowMouseUp', () => {
      const handleWindowMouseUp = jest.fn((): void => {});
      const handleModelAfterChange = jest.fn((values: number[]): void => {});
      const model = new Model({
        ...defaultProps,
        values: [10, 20],
        onAfterChange: handleModelAfterChange,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      view.publish('handleWindowMouseUp');
      expect(handleModelAfterChange.mock.calls.length).toBe(1);
      expect(handleModelAfterChange.mock.calls[0][0]).toStrictEqual([10, 20]);
    });

    test('handleViewClick', () => {
      const handleViewClick = jest.fn(
        (options: {
          index: number;
          event: MouseEvent;
          value?: number;
          length: number;
          start: number;
        }): void => {}
      );
      const model = new Model({
        ...defaultProps,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      const event = new MouseEvent('click');
      model.subscribe('handleViewClick', handleViewClick);
      view.publish('handleViewClick', {
        index: 10,
        start: 0,
        length: 100,
        event,
      });
      expect(handleViewClick.mock.calls.length).toBe(1);
      expect(handleViewClick.mock.calls[0][0]).toStrictEqual({
        index: 10,
        start: 0,
        length: 100,
        event,
      });
    });

    test('handleWindowMouseMove', () => {
      const handleWindowMouseMove = jest.fn(
        (options: {
          event: MouseEvent;
          length: number;
          start: number;
        }): void => {}
      );
      const model = new Model({
        ...defaultProps,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      const event = new MouseEvent('mousemove');
      model.subscribe('handleWindowMouseMove', handleWindowMouseMove);
      view.publish('handleWindowMouseMove', {
        start: 0,
        length: 100,
        event,
      });
      expect(handleWindowMouseMove.mock.calls.length).toBe(1);
      expect(handleWindowMouseMove.mock.calls[0][0]).toStrictEqual({
        start: 0,
        length: 100,
        event,
      });
    });
  });
});
