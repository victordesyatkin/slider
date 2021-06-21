import $ from 'jquery';
import merge from 'lodash.merge';

import * as utils from '../../helpers/utils';
import { Style } from '../../types';

const className1 = 'class1';
const className2 = 'class2';
const { defaultProps } = utils;

describe('helpers', () => {
  describe('utils', () => {
    test('style: undefined -> objectToString -> "" ', () => {
      expect(utils.objectToString()).toBe('');
    });

    test('style: { width: "100%", height: "100%" } -> objectToString -> width: 100%;height: 100%;', () => {
      expect(utils.objectToString({ width: '100%', height: '100%' })).toBe(
        'width: 100%;height: 100%;'
      );
    });

    test('calcOffset -> number', () => {
      expect(utils.calcOffset({ value: 5, min: 0, max: 100 })).toBe(5);
      expect(utils.calcOffset({ value: 25, min: 0, max: 100 })).toBe(25);
      expect(utils.calcOffset({ value: -5, min: 0, max: 100 })).toBe(0);
      expect(utils.calcOffset({ value: -5, min: -100, max: 100 })).toBe(48);
      expect(utils.calcOffset({ value: 0, min: -100, max: 100 })).toBe(50);
    });
    test('getHandleCenterPosition -> number', () => {
      utils.setFunctionGetBoundingClientRectHTMLElement();
      document.body.innerHTML = `<div class="${className1}" style="width:100px;height:100px;">hello world!</div>`;
      let el = $(`.${className1}`).get(0);
      expect(
        utils.getHandleCenterPosition({ isVertical: false, handle: el })
      ).toBe(50);
      document.body.innerHTML = '';
      document.body.innerHTML = `<div class="${className2}" style="width:50px;height:200px;">hello world!</div>`;
      el = $(`.${className2}`).get(0);
      expect(
        utils.getHandleCenterPosition({ isVertical: true, handle: el })
      ).toBe(100);
    });
    test('ensureValueInRange', () => {
      expect(utils.ensureValueInRange({ value: 4, min: -70, max: 30 })).toBe(4);
      expect(utils.ensureValueInRange({ value: 100, min: -70, max: 30 })).toBe(
        30
      );
      expect(utils.ensureValueInRange({ value: -200, min: -70, max: 30 })).toBe(
        -70
      );
      expect(utils.ensureValueInRange({ value: 16, min: 0, max: 4 })).toBe(4);
    });
    test('getMousePosition -> number', () => {
      let event = new MouseEvent('mousemove', {
        screenX: 4,
        screenY: 16,
        clientY: 22,
      });
      expect(utils.getMousePosition({ isVertical: true, event })).toBe(22);
      event = new MouseEvent('click', {
        screenX: 4,
        screenY: 40,
        clientY: 22,
      });
      expect(utils.getMousePosition({ isVertical: false, event })).toBe(0);
    });
    test('getPrecision -> number', () => {
      expect(utils.getPrecision(1.2452)).toBe(4);
      expect(utils.getPrecision(5.25)).toBe(2);
      expect(utils.getPrecision(25)).toBe(0);
    });
    test(' ensureValuePrecision -> number', () => {
      expect(
        utils.ensureValuePrecision({
          value: 14,
          min: defaultProps.min,
          max: defaultProps.max,
          step: defaultProps.step,
          extraValues: defaultProps.mark?.values,
        })
      ).toBe(14);
      expect(
        utils.ensureValuePrecision({
          value: 14,
          min: defaultProps.min,
          max: defaultProps.max,
          step: 25,
          extraValues: defaultProps.mark?.values,
        })
      ).toBe(25);
      expect(
        utils.ensureValuePrecision({
          value: 14,
          min: defaultProps.min,
          max: defaultProps.max,
          step: 25,
          extraValues: [16],
        })
      ).toBe(16);
    });
    test('getClosestPoint -> 16', () => {
      expect(
        utils.getClosestPoint({
          value: 20,
          step: 25,
          min: 16,
          max: 100,
          extraValues: defaultProps.mark?.values,
        })
      ).toBe(16);
    });
    test('getClosestPoint -> 30', () => {
      expect(
        utils.getClosestPoint({
          value: 38,
          step: 25,
          min: 0,
          max: 100,
          extraValues: [30],
        })
      ).toBe(30);
    });
    test('(props: tDefaultProps): tDefaultProps, props: tDefaultProps -> prepareValues -> tDefaultProps', () => {
      let input = merge({}, defaultProps, { values: [65, 35] });
      let output = { ...defaultProps, values: [35, 65] };
      expect(utils.prepareValues(input)).toEqual(output);
      input = merge({}, input, { step: 25 });
      output = { ...input, values: [25, 75] };
      let r = utils.prepareValues(input);
      expect(r).toEqual(output);
      expect(r.mark).toStrictEqual({ values: [] });
      expect(r?.mark?.values).toStrictEqual([]);
      input = merge({}, input, { step: 25 }, { mark: { values: [50, 40] } });
      r = utils.prepareValues(input);
      expect(r.mark).toEqual(
        expect.objectContaining({
          values: expect.any(Array),
        })
      );
      expect((r?.mark?.values || []).length).toBe(2);
      expect(r.mark?.values).toEqual(expect.arrayContaining([40, 50]));
    });
    test('getSliderStart', () => {
      expect(utils.getSliderStart({})).toBe(0);
      expect(
        utils.getSliderStart({
          isVertical: defaultProps.isVertical,
          isReverse: defaultProps.isReverse,
        })
      ).toBe(0);
      document.body.innerHTML = `<div class="${className1}" style="width:100px;height:100px;">hello world!</div>`;
      let $element = $(`.${className1}`);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({
          isVertical: defaultProps.isVertical,
          isReverse: defaultProps.isReverse,
          view: $element,
        })
      ).toBe(0);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        marginTop: 10,
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({
          isVertical: true,
          isReverse: defaultProps.isReverse,
          view: $element,
        })
      ).toBe(10);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        marginBottom: 40,
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({
          isVertical: true,
          isReverse: true,
          view: $element,
        })
      ).toBe(40);
    });
    test('getSliderLength', () => {
      utils.setFunctionGetBoundingClientRectHTMLElement({
        width: 200,
        height: 100,
      });
      document.body.innerHTML = `<div class="${className1}" style="width:200px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      expect(
        utils.getSliderLength({
          view: $el,
          isVertical: defaultProps.isVertical,
        })
      ).toBe(200);
      expect(
        utils.getSliderLength({
          view: $el,
          isVertical: true,
        })
      ).toBe(100);
    });

    test('calcValue', () => {
      utils.setFunctionGetBoundingClientRectHTMLElement({
        width: 200,
        height: 100,
      });
      document.body.innerHTML = `<div class="${className1}" style="width:200px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      expect(
        utils.calcValue({
          offset: 50,
          length: 200,
          isVertical: defaultProps.isVertical,
          min: defaultProps.min,
          max: defaultProps.max,
          step: defaultProps.step,
        })
      ).toBe(25);
      expect(
        utils.calcValue({
          offset: 50,
          length: 100,
          isVertical: defaultProps.isVertical,
          min: defaultProps.min,
          max: defaultProps.max,
          step: defaultProps.step,
        })
      ).toBe(50);
    });
    test('calcValueByPos', () => {
      utils.setFunctionGetBoundingClientRectHTMLElement({
        width: 200,
        height: 100,
      });
      document.body.innerHTML = `<div class="${className1}" style="width:200px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      expect(
        utils.calcValueByPos({
          position: 50,
          length: 200,
          isVertical: defaultProps.isVertical,
          min: defaultProps.min,
          max: defaultProps.max,
          step: defaultProps.step,
          index: 0,
          start: 0,
          isReverse: defaultProps.isReverse,
          indent: defaultProps.indent,
          values: defaultProps.values,
          extraValues: defaultProps?.mark?.values,
        })
      ).toBe(25);
      expect(
        utils.calcValueByPos({
          position: 50,
          length: 100,
          index: 0,
          start: 0,
          isVertical: defaultProps.isVertical,
          min: defaultProps.min,
          max: defaultProps.max,
          step: defaultProps.step,
          isReverse: defaultProps.isReverse,
          indent: defaultProps.indent,
          values: defaultProps.values,
          extraValues: defaultProps?.mark?.values,
        })
      ).toBe(50);
    });
    test('checkNeighbors', () => {
      expect(utils.checkNeighbors([20, 40])).toBeTruthy();
      expect(utils.checkNeighbors([20])).toBeFalsy();
    });
    test('ensureValueCorrectNeighbors', () => {
      expect(
        utils.ensureValueCorrectNeighbors({
          value: 20,
          index: 0,
          min: defaultProps.min,
          max: defaultProps.max,
          values: defaultProps.values,
          indent: defaultProps.indent,
        })
      ).toBe(20);
      expect(
        utils.ensureValueCorrectNeighbors({
          value: 40,
          index: 1,
          min: defaultProps.min,
          max: defaultProps.max,
          values: defaultProps.values,
          indent: defaultProps.indent,
        })
      ).toBe(40);
    });
    test('calcValueWithEnsure', () => {
      expect(
        utils.calcValueWithEnsure({
          value: 20,
          index: 0,
          min: defaultProps.min,
          max: defaultProps.max,
          values: defaultProps.values,
          indent: defaultProps.indent,
          step: defaultProps.step,
          extraValues: defaultProps?.mark?.values,
        })
      ).toBe(20);
      const value = utils.calcValueWithEnsure({
        value: 80,
        index: 1,
        min: defaultProps.min,
        max: 50,
        values: [40, 60],
        indent: 10,
        step: defaultProps.step,
        extraValues: defaultProps?.mark?.values,
      });
      expect(value).toBe(50);
    });
    test('prepareData', () => {
      expect(utils.prepareData()).toEqual(
        expect.objectContaining({
          ...defaultProps,
          mark: {
            ...defaultProps.mark,
            isOn: false,
            withDot: false,
            className: null,
            render: null,
            style: null,
            wrapClassName: null,
            values: [defaultProps.min, defaultProps.max],
          },
        })
      );
      let props = utils.prepareData({ values: [30, 25] });
      expect(props.values).toEqual(expect.arrayContaining([30, 25]));
      props = utils.prepareData({ values: [14, 25] });
      expect(props.values).toEqual(expect.arrayContaining([14, 25]));
    });
    test('uniqId', () => {
      const id1 = utils.uniqId();
      const id2 = utils.uniqId();
      expect(id1).toEqual(expect.any(String));
      expect(id2).toEqual(expect.not.stringContaining(id1));
    });
    test('getPosition', () => {
      const position1 = utils.getPosition({
        isVertical: false,
        coordinateX: 10,
        coordinateY: 40,
      });
      const position2 = utils.getPosition({
        isVertical: true,
        coordinateX: 10,
        coordinateY: 40,
      });
      expect(position1).toEqual(10);
      expect(position2).toEqual(40);
    });
    test('getNearest isDirectToMin', () => {
      const item = utils.getNearest({
        value: 65,
        values: [10, 30, 70, 100],
      });
      expect(item).toStrictEqual({
        index: 2,
        value: 70,
      });
    });
    test('getNearest isDirectToMax', () => {
      const item = utils.getNearest({
        value: 85,
        values: [10, 30, 70, 100],
      });
      expect(item).toStrictEqual({
        index: 2,
        value: 70,
      });
    });
    test('getNearestIndex', () => {
      const options = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [0, 100],
        isReverse: defaultProps.isReverse,
      };
      const index = utils.getNearestIndex(options);
      expect(index).toEqual(1);
    });
    test('getCorrectIndex', () => {
      const options = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        length: 100,
        index: undefined,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [0, 100],
        isReverse: defaultProps.isReverse,
      };
      const { index: index0, isCorrect: isCorrect0 } = utils.getCorrectIndex(
        options
      );
      expect(isCorrect0).toEqual(true);
      expect(index0).toEqual(1);
      let options1 = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        index: 1,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [0, 100],
        isReverse: defaultProps.isReverse,
      };
      const { index: index1, isCorrect: isCorrect1 } = utils.getCorrectIndex(
        options1
      );
      expect(index1).toEqual(1);
      expect(isCorrect1).toEqual(false);
      options1 = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        index: 1,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [45, 40],
        isReverse: defaultProps.isReverse,
      };
      const { index: index2, isCorrect: isCorrect2 } = utils.getCorrectIndex(
        options1
      );
      expect(index2).toEqual(1);
      expect(isCorrect2).toEqual(false);
      options1 = {
        coordinateX: 35,
        coordinateY: 10,
        start: 0,
        index: 1,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [40, 40],
        isReverse: defaultProps.isReverse,
      };
      const { index: index3, isCorrect: isCorrect3 } = utils.getCorrectIndex(
        options1
      );
      expect(index3).toEqual(0);
      expect(isCorrect3).toEqual(true);
      options1 = {
        coordinateX: 35,
        coordinateY: 10,
        start: 0,
        index: -1,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [40, 40],
        isReverse: defaultProps.isReverse,
      };
      const { index: index4, isCorrect: isCorrect4 } = utils.getCorrectIndex(
        options1
      );
      expect(index4).toEqual(0);
      expect(isCorrect4).toEqual(true);
      options1 = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        index: -1,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [40, 45],
        isReverse: defaultProps.isReverse,
      };
      const { index: index5, isCorrect: isCorrect5 } = utils.getCorrectIndex(
        options1
      );
      expect(index5).toEqual(1);
      expect(isCorrect5).toEqual(true);
      options1 = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        index: 0,
        length: 100,
        isVertical: defaultProps.isVertical,
        min: defaultProps.min,
        max: defaultProps.max,
        step: defaultProps.step,
        values: [40, 45],
        isReverse: defaultProps.isReverse,
      };
      const { index: index6, isCorrect: isCorrect6 } = utils.getCorrectIndex(
        options1
      );
      expect(index6).toEqual(0);
      expect(isCorrect6).toEqual(false);
    });
    test('isDirectionToMin', () => {
      expect(
        utils.isDirectionToMin({
          value: 30,
          item: 60,
        })
      ).toEqual(true);
      expect(
        utils.isDirectionToMin({
          value: 80,
          item: 60,
        })
      ).toEqual(false);
    });
    test('correctData', () => {
      let props = utils.correctData({
        ...defaultProps,
      });
      expect(props).toEqual(
        expect.objectContaining({
          min: defaultProps.min,
          max: defaultProps.max,
          precision: defaultProps.precision,
          step: defaultProps.step,
          indent: defaultProps.indent,
        })
      );
      props = utils.correctData({
        ...defaultProps,
        min: 105,
        max: 100,
        step: -3,
        precision: -4,
        indent: -5,
        index: -6,
        classNames: ['bbbbb', 'aaaa'],
        style: { color: 'red' },
        dot: {
          className: '',
          wrapClassName: '',
          style: { 'background-color': 'yellow' },
        },
        mark: {
          className: 'cccc',
          wrapClassName: 'eeee',
          style: { 'background-color': 'yellow' },
          values: [-50, 200, 100],
        },
        rail: {
          className: 'cccc',
          style: { 'background-color': 'yellow' },
        },
        track: {
          classNames: ['cccc'],
          styles: [
            { 'background-color': 'yellow' },
            { 'background-color': 'green' },
          ],
        },
        handle: {
          classNames: ['cccc'],
          styles: [
            { 'background-color': 'yellow' },
            { 'background-color': 'green' },
          ],
        },
      });
      expect(props).toEqual(
        expect.objectContaining({
          min: -100,
          max: 100,
          precision: defaultProps.precision,
          step: defaultProps.step,
          indent: defaultProps.indent,
          classNames: ['bbbbb', 'aaaa'],
          style: { color: 'red' },
          index: undefined,
          handle: {
            classNames: ['cccc'],
            styles: [
              { 'background-color': 'yellow' },
              { 'background-color': 'green' },
            ],
          },
          track: {
            classNames: ['cccc'],
            styles: [
              { 'background-color': 'yellow' },
              { 'background-color': 'green' },
            ],
          },
          dot: {
            className: null,
            wrapClassName: null,
            style: { 'background-color': 'yellow' },
          },
          mark: {
            className: 'cccc',
            wrapClassName: 'eeee',
            style: { 'background-color': 'yellow' },
            values: [-100, -50, 100],
            render: null,
            isOn: false,
            withDot: false,
          },
        })
      );
    });
    test('correctIsOn', () => {
      expect(utils.correctIsOn()).toBe(false);
      expect(utils.correctIsOn({})).toBe(false);
      expect(utils.correctIsOn({ isOn: false })).toBe(false);
      expect(utils.correctIsOn({ isOn: true })).toBe(true);
    });
    test('correctWithDot', () => {
      expect(utils.correctWithDot()).toBe(false);
      expect(utils.correctWithDot({})).toBe(false);
      expect(utils.correctWithDot({ withDot: false })).toBe(false);
      expect(utils.correctWithDot({ withDot: true })).toBe(true);
    });
    test('correctIsAlways', () => {
      expect(utils.correctIsAlways()).toBe(false);
      expect(utils.correctIsAlways({})).toBe(false);
      expect(utils.correctIsAlways({ isAlways: false })).toBe(false);
      expect(utils.correctIsAlways({ isAlways: true })).toBe(true);
    });
    test('checkIsCorrectStep', () => {
      expect(utils.checkIsCorrectStep()).toBe(false);
      expect(utils.checkIsCorrectStep('')).toBe(false);
      expect(utils.checkIsCorrectStep(true)).toBe(false);
      expect(utils.checkIsCorrectStep(null)).toBe(false);
      expect(utils.checkIsCorrectStep(0)).toBe(false);
      expect(utils.checkIsCorrectStep(1)).toBe(true);
      expect(utils.checkIsCorrectStep(-7)).toBe(false);
    });
    test('correctRender', () => {
      expect(utils.correctRender()).toBe(null);
      expect(utils.correctRender({})).toBe(null);
      expect(utils.correctRender({ render: null })).toBe(null);
      const render = () => undefined;
      expect(utils.correctRender({ render })).toBe(render);
    });
    test('correctTrack', () => {
      expect(utils.correctTrack()).toBe(undefined);
      expect(utils.correctTrack({})).toBe(undefined);
      const entity = {
        isOn: null,
        classNames: null,
        styles: null,
      };
      expect(utils.correctTrack({ entity })).toEqual(
        expect.objectContaining({
          isOn: false,
          classNames: null,
          styles: null,
        })
      );
      const entity1 = {
        classNames: null,
        styles: null,
      };
      expect(utils.correctTrack({ entity: entity1 })).toEqual(
        expect.objectContaining({
          classNames: null,
          styles: null,
        })
      );
      const entity2 = {
        isOn: false,
        styles: null,
      };
      expect(utils.correctTrack({ entity: entity2 })).toEqual(
        expect.objectContaining({
          isOn: false,
          styles: null,
        })
      );
      const entity3 = {
        isOn: true,
        classNames: ['aaaa', 'bbbb'],
      };
      expect(utils.correctTrack({ entity: entity3 })).toEqual(
        expect.objectContaining({
          isOn: true,
          classNames: ['aaaa', 'bbbb'],
        })
      );
      const entity4 = {
        isOn: true,
        classNames: ['aaaa'],
        styles: [{ color: 'red' }, null],
      };
      expect(utils.correctTrack({ entity: entity4 })).toEqual(
        expect.objectContaining({
          isOn: true,
          classNames: ['aaaa'],
          styles: [{ color: 'red' }],
        })
      );
    });
    test('correctHandle', () => {
      expect(utils.correctHandle()).toBe(undefined);
      expect(utils.correctHandle({})).toBe(undefined);
      const entity = {
        classNames: null,
        styles: null,
      };
      expect(utils.correctHandle({ entity })).toEqual(
        expect.objectContaining({
          classNames: null,
          styles: null,
        })
      );
      const entity2 = {
        styles: null,
      };
      expect(utils.correctHandle({ entity: entity2 })).toEqual(
        expect.objectContaining({
          styles: null,
        })
      );
      const entity3 = {
        classNames: ['aaaa', 'bbbb'],
      };
      expect(utils.correctHandle({ entity: entity3 })).toEqual(
        expect.objectContaining({
          classNames: ['aaaa', 'bbbb'],
        })
      );
      const entity4 = {
        classNames: ['aaaa'],
        styles: [{ color: 'red' }, null],
      };
      expect(utils.correctHandle({ entity: entity4 })).toEqual(
        expect.objectContaining({
          classNames: ['aaaa'],
          styles: [{ color: 'red' }],
        })
      );
    });
    test('correctMark', () => {
      expect(utils.correctMark()).toEqual(expect.objectContaining({}));
      expect(utils.correctMark({})).toEqual(expect.objectContaining({}));
      const entity = {
        className: null,
        style: null,
        render: null,
        values: null,
        isOn: null,
        withDot: null,
      };
      expect(
        utils.correctMark({
          entity,
          properties: [
            'className',
            'style',
            'render',
            'values',
            'isOn',
            'withDot',
          ],
        })
      ).toEqual(
        expect.objectContaining({
          className: null,
          style: null,
          render: null,
          values: null,
          isOn: false,
          withDot: false,
        })
      );
      const render = () => undefined;
      const entity2 = {
        className: 'aaaa',
        style: {},
        render,
        values: [1, 17],
        isOn: true,
        withDot: false,
      };
      expect(
        utils.correctMark({
          entity: entity2,
          properties: [
            'className',
            'style',
            'render',
            'values',
            'isOn',
            'withDot',
          ],
        })
      ).toEqual(
        expect.objectContaining({
          className: 'aaaa',
          style: null,
          render,
          values: null,
          isOn: true,
          withDot: false,
        })
      );
      const entity3 = {
        className: 'bbbb',
        style: { color: 'red' },
        render,
        values: [1, 17],
        isOn: true,
        withDot: false,
      };
      expect(
        utils.correctMark({
          entity: entity3,
          min: defaultProps.min,
          max: defaultProps.max,
          properties: [
            'className',
            'style',
            'render',
            'values',
            'isOn',
            'withDot',
          ],
        })
      ).toEqual(
        expect.objectContaining({
          className: 'bbbb',
          style: { color: 'red' },
          render,
          values: [0, 1, 17, 100],
          isOn: true,
          withDot: false,
        })
      );
    });
    test('correctDot', () => {
      expect(utils.correctDot()).toBe(undefined);
      expect(utils.correctDot({})).toBe(undefined);
      const entity = {
        wrapClassName: null,
        className: null,
        style: null,
        isOn: null,
      };
      expect(utils.correctDot({ entity })).toEqual(
        expect.objectContaining({
          wrapClassName: null,
          className: null,
          style: null,
          isOn: false,
        })
      );
      const entity2 = {
        wrapClassName: '',
        className: '',
        style: { color: 'red' },
        isOn: true,
      };
      expect(utils.correctDot({ entity: entity2 })).toEqual(
        expect.objectContaining({
          wrapClassName: null,
          className: null,
          style: { color: 'red' },
          isOn: true,
        })
      );
      const entity3 = {
        wrapClassName: 'aaaa',
        className: 'bbbb',
        style: { color: 'green' },
        isOn: false,
      };
      expect(
        utils.correctDot({
          entity: entity3,
        })
      ).toEqual(
        expect.objectContaining({
          wrapClassName: 'aaaa',
          className: 'bbbb',
          style: { color: 'green' },
          isOn: false,
        })
      );
    });
    test('correctTooltip', () => {
      expect(utils.correctTooltip()).toBe(undefined);
      expect(utils.correctTooltip({})).toBe(undefined);
      const entity = {
        className: null,
        style: null,
        render: null,
        isOn: null,
        isAlways: null,
      };
      expect(utils.correctTooltip({ entity })).toEqual(
        expect.objectContaining({
          className: null,
          style: null,
          render: null,
          isOn: false,
          isAlways: false,
        })
      );
      const render = () => undefined;
      const entity2 = {
        className: 'aaaa',
        style: null,
        render,
        isOn: true,
        isAlways: false,
      };
      expect(utils.correctTooltip({ entity: entity2 })).toEqual(
        expect.objectContaining({
          className: 'aaaa',
          style: null,
          render,
          isOn: true,
          isAlways: false,
        })
      );
      const entity3 = {
        className: 'bbbb',
        style: { color: 'red' },
        render,
        isOn: false,
        isAlways: true,
      };
      expect(
        utils.correctTooltip({
          entity: entity3,
        })
      ).toEqual(
        expect.objectContaining({
          className: 'bbbb',
          style: { color: 'red' },
          render,
          isOn: false,
          isAlways: true,
        })
      );
    });
    test('correctRail', () => {
      expect(utils.correctRail()).toBe(undefined);
      expect(utils.correctRail({})).toBe(undefined);
      const entity = {
        className: null,
        style: null,
        isOn: null,
      };
      expect(utils.correctRail({ entity })).toEqual(
        expect.objectContaining({
          className: null,
          style: null,
          isOn: false,
        })
      );
      const entity2 = {
        className: 'aaaa',
        style: null,
        isOn: true,
      };
      expect(utils.correctRail({ entity: entity2 })).toEqual(
        expect.objectContaining({
          className: 'aaaa',
          style: null,
          isOn: true,
        })
      );
      const entity3 = {
        className: 'bbbb',
        style: { color: 'red' },
        isOn: false,
      };
      expect(
        utils.correctRail({
          entity: entity3,
        })
      ).toEqual(
        expect.objectContaining({
          className: 'bbbb',
          style: { color: 'red' },
          isOn: false,
        })
      );
    });
    test('correctMin', () => {
      let props = { ...defaultProps };
      expect(utils.correctMin({ min: 5, max: props.max })).toEqual(5);
      expect(utils.correctMin({ min: 105, max: props.max })).toEqual(-100);
    });
    test('correctMax', () => {
      const props = { ...defaultProps };
      expect(utils.correctMax({ min: props.min, max: props.max })).toEqual(100);
      expect(utils.correctMax({ min: props.min, max: -7 })).toEqual(100);
    });
    test('correctStep', () => {
      let props = { ...defaultProps };
      expect(
        utils.correctStep({
          step: 5,
          min: props.min,
          max: props.max,
        })
      ).toEqual(5);
      expect(
        utils.correctStep({
          step: -5,
          min: props.min,
          max: props.max,
        })
      ).toEqual(0);
      props = { ...defaultProps, max: -10, min: -50, step: 5 };
      expect(
        utils.correctStep({
          step: -5,
          min: props.min,
          max: props.max,
        })
      ).toEqual(0);
      props = { ...defaultProps, max: -10, min: -50, step: 6 };
      expect(
        utils.correctStep({
          step: 10,
          min: props.min,
          max: props.max,
        })
      ).toEqual(10);
    });
    test('correctPrecision', () => {
      expect(utils.correctPrecision({ precision: 4 })).toEqual(4);
      expect(utils.correctPrecision({ precision: -5 })).toEqual(0);
    });
    test('correctIndent', () => {
      const props = { ...defaultProps };
      expect(
        utils.correctIndent({
          indent: 4,
          values: props.values,
          max: props.max,
        })
      ).toEqual(4);
      expect(
        utils.correctIndent({
          indent: -5,
          values: props.values,
          max: props.max,
        })
      ).toEqual(0);
    });
    test('correctClassNames', () => {
      let classNames: string[] | null = ['aaaa', 'bbbb'];
      expect(
        utils.correctClassNames({
          classNames,
        })
      ).toEqual(expect.arrayContaining(['aaaa', 'bbbb']));
      classNames = null;
      expect(utils.correctClassNames({ classNames })).toEqual(null);
    });
    test('isNeedCorrectStyle', () => {
      expect(
        utils.isNeedCorrectStyle({
          color: 'green',
        })
      ).toEqual(false);
      expect(utils.isNeedCorrectStyle(null)).toEqual(true);
    });

    test('correctStyles', () => {
      let styles: Partial<{
        styles: Style[] | null;
      }> = {
        styles: [{ 'font-size': '1rem' }],
      };
      expect(utils.correctStyles(styles)).toEqual(
        expect.arrayContaining([{ 'font-size': '1rem' }])
      );
      styles = {
        styles: null,
      };
      expect(utils.correctStyles(styles)).toEqual(null);
      styles = {};
      expect(utils.correctStyles(styles)).toEqual(null);
    });
    test('correctStyle', () => {
      let style: Partial<{
        style?: Style | null;
      }> = {
        style: { 'font-size': '1rem' },
      };
      expect(utils.correctStyle(style)).toEqual(
        expect.objectContaining({ 'font-size': '1rem' })
      );
      style = {
        style: null,
      };
      expect(utils.correctStyle(style)).toEqual(null);
      style = {};
      expect(utils.correctStyle(style)).toEqual(null);
    });
    test('correctClassName', () => {
      let className: Partial<{
        className: string | null;
      }> = {
        className: 'aaaa',
      };
      expect(utils.correctClassName(className)).toEqual('aaaa');
      className = {
        className: '',
      };
      expect(utils.correctClassName(className)).toEqual(null);
      className = {};
      expect(utils.correctClassName(className)).toEqual(null);
    });
    test('correctWrapClassName', () => {
      let wrapClassName: Partial<{
        wrapClassName: string | null;
      }> = {
        wrapClassName: 'aaaa',
      };
      expect(utils.correctWrapClassName(wrapClassName)).toEqual('aaaa');
      wrapClassName = {
        wrapClassName: '',
      };
      expect(utils.correctWrapClassName(wrapClassName)).toEqual(null);
      wrapClassName = {};
      expect(utils.correctWrapClassName(wrapClassName)).toEqual(null);
    });
    test('correctValues', () => {
      let values: Partial<{
        values: number[];
        min: number;
        max: number;
      }> = {
        values: null,
      };
      expect(utils.correctValues(values)).toEqual(null);
      values = {
        values: null,
        min: defaultProps.min,
      };
      expect(utils.correctValues(values)).toEqual(null);
      values = {
        values: null,
        max: defaultProps.max,
      };
      expect(utils.correctValues(values)).toEqual(null);
      values = {
        values: null,
        min: defaultProps.min,
        max: defaultProps.max,
      };
      expect(utils.correctValues(values)).toEqual(
        expect.arrayContaining([defaultProps.min, defaultProps.max])
      );
      values = {
        values: [-14],
        min: defaultProps.min,
        max: defaultProps.max,
      };
      expect(utils.correctValues(values)).toEqual(
        expect.arrayContaining([0, 0, 100])
      );
      values = {
        values: [7, 4],
        min: defaultProps.min,
        max: defaultProps.max,
      };
      expect(utils.correctValues(values)).toEqual(
        expect.arrayContaining([0, 4, 7, 100])
      );
    });
    test('correctIndex', () => {
      let options = {
        values: defaultProps.values,
        index: undefined,
      };
      expect(utils.correctIndex(options)).toEqual(undefined);
      options = {
        index: 7,
        values: defaultProps.values,
      };
      expect(utils.correctIndex(options)).toEqual(defaultProps.index);
      options = {
        index: -5,
        values: defaultProps.values,
      };
      expect(utils.correctIndex(options)).toEqual(defaultProps.index);
      options = {
        index: 1,
        values: [20, 50],
      };
      expect(utils.correctIndex(options)).toEqual(1);
      options = {
        index: 1,
        values: [60],
      };
      expect(utils.correctIndex(options)).toEqual(defaultProps.index);
      options = {
        index: 0,
        values: [60],
      };
      expect(utils.correctIndex(options)).toEqual(0);
    });
  });
});
