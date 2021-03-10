import $ from 'jquery';

import {
  defaultProps,
  setFunctionGetBoundingClientRectHTMLElement,
  uniqId,
} from '../../helpers/utils';
import Model from '../../slider/model';
import View from '../../slider/view';
import Presenter from '../../slider/presenter';

describe('slider', () => {
  describe('presenter', () => {
    test('new presenter', () => {
      const model = new Model(defaultProps);
      const view = new View();
      const presenter = new Presenter(model, view);
      expect(presenter).toBeInstanceOf(Presenter);
    });

    test('initHandlesView, initHandlesModel, onBeforeChange', () => {
      const model = new Model(defaultProps);
      const view = new View();
      const presenter = new Presenter(model, view);
      view.publish('onBeforeChange', { index: 5 });
      const props = presenter.getProps();
      expect(props).toEqual(
        expect.objectContaining({
          index: 5,
        })
      );
      setFunctionGetBoundingClientRectHTMLElement();
      const className = `slider__wrapper-${uniqId()}`;
      $('body').append(`<div class="${className}"/>`);
      const $parent = $(`.${className}`);
      view.render($parent);
      let $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      expect($handle.length).toEqual(1);
      model.publish('setPropsForView', {
        ...defaultProps,
        values: [10, 20],
      });
      $handle = $(`.${defaultProps.prefixCls}__handle`, $parent);
      expect($handle.length).toEqual(2);
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
      expect(onChange.mock.calls.length).toBe(1);
      expect(onChange.mock.calls[0][0]).toStrictEqual([20]);
      expect(onChange.mock.calls.length).toBe(1);
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

    test('setIndex', () => {
      const model = new Model({
        ...defaultProps,
      });
      const view = new View();
      const presenter = new Presenter(model, view);
      const props = { ...defaultProps };
      presenter.setProps(props);
      let index = presenter.getProps()?.index;
      expect(index).toEqual(undefined);
      view.publish('setIndex', { index: 1 });
      index = presenter.getProps()?.index;
      expect(index).toEqual(1);
    });
  });
});
