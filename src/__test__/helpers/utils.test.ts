import $ from 'jquery';
import merge from 'lodash.merge';

import * as utils from '../../helpers/utils';

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

    test('value, min, max, precision? = 0 -> calcOffset -> number', () => {
      expect(utils.calcOffset(5, 0, 100)).toBe(5);
      expect(utils.calcOffset(25, 0, 100)).toBe(25);
      expect(utils.calcOffset(-5, 0, 100)).toBe(0);
      expect(utils.calcOffset(-5, -100, 100)).toBe(48);
      expect(utils.calcOffset(0, -100, 100)).toBe(50);
    });

    test('vertical, HTMLElement -> getHandleCenterPosition -> number', () => {
      utils.setFunctionGetBoundingClientRectHTMLElement();
      document.body.innerHTML = `<div class="${className1}" style="width:100px;height:100px;">hello world!</div>`;
      let el = $(`.${className1}`).get(0);
      expect(utils.getHandleCenterPosition(false, el)).toBe(50);
      document.body.innerHTML = '';
      document.body.innerHTML = `<div class="${className2}" style="width:50px;height:200px;">hello world!</div>`;
      el = $(`.${className2}`).get(0);
      expect(utils.getHandleCenterPosition(true, el)).toBe(100);
    });
    test('val: number, { max, min }: { max: number; min: number } -> ensureValueInRange -> number', () => {
      expect(utils.ensureValueInRange(4, { min: -70, max: 30 })).toBe(4);
      expect(utils.ensureValueInRange(100, { min: -70, max: 30 })).toBe(30);
      expect(utils.ensureValueInRange(-200, { min: -70, max: 30 })).toBe(-70);
      expect(utils.ensureValueInRange(16, { min: 0, max: 4 })).toBe(4);
    });
    test('(vertical: boolean, e: MouseEvent): number -> getMousePosition -> number', () => {
      let e = new MouseEvent('mousemove', {
        screenX: 4,
        screenY: 16,
        clientY: 22,
      });
      expect(utils.getMousePosition(true, e)).toBe(22);
      e = new MouseEvent('click', {
        screenX: 4,
        screenY: 40,
        clientY: 22,
      });
      expect(utils.getMousePosition(false, e)).toBe(0);
    });
    test('(step: number): number -> getPrecision -> number', () => {
      expect(utils.getPrecision(1.2452)).toBe(4);
      expect(utils.getPrecision(5.25)).toBe(2);
      expect(utils.getPrecision(25)).toBe(0);
    });
    test('v: number, props: tDefaultProps:number -> ensureValuePrecision -> number', () => {
      expect(utils.ensureValuePrecision(14, defaultProps)).toBe(14);
      expect(
        utils.ensureValuePrecision(14, merge({}, defaultProps, { step: 25 }))
      ).toBe(25);
      expect(
        utils.ensureValuePrecision(
          14,
          merge({}, defaultProps, { step: 25, mark: { values: [16] } })
        )
      ).toBe(16);
    });
    test('14, { step: undefined, min: 16, max: 100 }, props: tDefaultProps -> getClosestPoint -> 16', () => {
      expect(
        utils.getClosestPoint(
          14,
          { step: undefined, min: 16, max: 100 },
          defaultProps
        )
      ).toBe(14);
    });
    test('20, { step: 25, min: 16, max: 100 }, tDefaultProps -> getClosestPoint -> 16', () => {
      expect(
        utils.getClosestPoint(20, { step: 25, min: 16, max: 100 }, defaultProps)
      ).toBe(16);
    });
    test('38, { step: 25, min: 0, max: 100 }, tDefaultProps -> getClosestPoint -> 30', () => {
      expect(
        utils.getClosestPoint(
          38,
          { step: 25, min: 0, max: 100 },
          merge({}, defaultProps, { mark: { values: [30] } })
        )
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
    test('undefined -> getCount -> 0', () => {
      expect(utils.getCount()).toBe(0);
    });
    test('values: [10, 48, 14] -> getCount -> 3', () => {
      expect(utils.getCount({ ...defaultProps, values: [10, 48, 14] })).toBe(3);
    });
    test('getSliderStart', () => {
      expect(utils.getSliderStart({})).toBe(0);
      expect(utils.getSliderStart({ props: { ...defaultProps } })).toBe(0);
      document.body.innerHTML = `<div class="${className1}" style="width:100px;height:100px;">hello world!</div>`;
      let $el = $(`.${className1}`);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({ props: { ...defaultProps }, view: $el })
      ).toBe(0);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        marginTop: 10,
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({
          props: { ...defaultProps, vertical: true },
          view: $el,
        })
      ).toBe(10);
      utils.setFunctionGetBoundingClientRectHTMLElement({
        marginBottom: 40,
        height: 100,
        width: 100,
      });
      expect(
        utils.getSliderStart({
          props: { ...defaultProps, vertical: true, reverse: true },
          view: $el,
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
        utils.getSliderLength({ view: $el, props: { ...defaultProps } })
      ).toBe(200);
      expect(
        utils.getSliderLength({
          view: $el,
          props: { ...defaultProps, vertical: true },
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
          props: { ...defaultProps },
        })
      ).toBe(25);
      expect(
        utils.calcValue({
          offset: 50,
          length: 100,
          props: { ...defaultProps, vertical: true },
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
          props: { ...defaultProps },
          index: 0,
          start: 0,
        })
      ).toBe(25);
      expect(
        utils.calcValueByPos({
          position: 50,
          length: 100,
          props: { ...defaultProps, vertical: true },
          index: 0,
          start: 0,
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
          props: defaultProps,
          index: 0,
        })
      ).toBe(20);
      expect(
        utils.ensureValueCorrectNeighbors({
          value: 40,
          props: { ...defaultProps, values: [40, 60], indent: 10 },
          index: 1,
        })
      ).toBe(50);
    });
    test('calcValueWithEnsure', () => {
      expect(
        utils.calcValueWithEnsure({
          value: 20,
          props: defaultProps,
          index: 0,
        })
      ).toBe(20);
      const v = utils.calcValueWithEnsure({
        value: 80,
        props: { ...defaultProps, values: [40, 60], indent: 10, max: 50 },
        index: 1,
      });
      expect(v).toBe(50);
    });
    test('prepareData', () => {
      expect(utils.prepareData()).toEqual(
        expect.objectContaining(defaultProps)
      );
      let props = utils.prepareData({ values: [30, 25] });
      expect(props.values).toEqual(expect.arrayContaining([30, 25]));
      props = utils.prepareData(
        { values: [14, 25] },
        { ...defaultProps, values: [18] }
      );
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
        vertical: false,
        coordinateX: 10,
        coordinateY: 40,
      });
      const position2 = utils.getPosition({
        vertical: true,
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
        props: defaultProps,
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
        props: defaultProps,
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
        props: { ...defaultProps, values: [0, 100] },
        length: 100,
      };
      const index = utils.getNearestIndex(options);
      expect(index).toEqual(1);
    });
    test('getCorrectIndex', () => {
      const options = {
        coordinateX: 80,
        coordinateY: 10,
        start: 0,
        props: { ...defaultProps, values: [0, 100] },
        length: 100,
        index: undefined,
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
        props: { ...defaultProps, values: [0, 100] },
        index: 1,
        length: 100,
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
        props: { ...defaultProps, values: [45, 40] },
        index: 1,
        length: 100,
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
        props: { ...defaultProps, values: [40, 40] },
        index: 1,
        length: 100,
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
        props: { ...defaultProps, values: [40, 40] },
        index: -1,
        length: 100,
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
        props: { ...defaultProps, values: [40, 45] },
        index: -1,
        length: 100,
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
        props: { ...defaultProps, values: [40, 45] },
        index: 0,
        length: 100,
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
          props: { ...defaultProps },
          item: 60,
        })
      ).toEqual(true);
      expect(
        utils.isDirectionToMin({
          value: 80,
          props: { ...defaultProps },
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
            className: undefined,
            wrapClassName: undefined,
            style: { 'background-color': 'yellow' },
          },
          mark: {
            className: 'cccc',
            wrapClassName: 'eeee',
            style: { 'background-color': 'yellow' },
          },
        })
      );
    });
    test('correctSet', () => {
      const mock = jest.fn((v: number) => `${v}`);
      const props = {
        handle: {
          classNames: [{}, 4, [], false, true, 0, 'aaaa'],
          styles: [{}, 4, [], false, true, 0, 'aaaa', { color: 'red' }],
        },
        rail: {
          className: [],
          styles: [{ color: 'red' }, 'aaaa', false, 0, true, 1, [], {}, 7],
        },
        dot: {
          wrapClassName: [0, 4, false, true, 0, {}, 'aaaa-bbbb'],
          style: false,
          className: 'aaaa',
        },
        mark: {
          wrapClassName: 'cccc',
          style: { background: 'red' },
          className: 'eeee',
          render: mock,
        },
      };
      utils.correctSet({
        key: 'handle',
        props: defaultProps,
        values: props.handle,
      });
      expect(props.handle).toEqual(
        expect.objectContaining({
          classNames: ['aaaa'],
          styles: [{ color: 'red' }],
        })
      );
      utils.correctSet({
        key: 'rail',
        props: defaultProps,
        values: props.rail,
      });
      expect(props.rail).toEqual(
        expect.objectContaining({
          className: undefined,
          styles: [{ color: 'red' }],
        })
      );
      utils.correctSet({
        key: 'dot',
        props: defaultProps,
        values: props.dot,
      });
      expect(props.dot).toEqual(
        expect.objectContaining({
          wrapClassName: undefined,
          style: undefined,
          className: 'aaaa',
        })
      );
      utils.correctSet({
        key: 'mark',
        props: defaultProps,
        values: props.mark,
      });
      expect(props.mark).toEqual(
        expect.objectContaining({
          wrapClassName: 'cccc',
          style: { background: 'red' },
          className: 'eeee',
          render: mock,
        })
      );
    });
    test('correctMin', () => {
      let props = { ...defaultProps };
      utils.correctMin({
        key: 'min',
        props,
        values: 5,
      });
      expect(props.min).toEqual(0);
      props = { ...defaultProps };
      utils.correctMin({
        key: 'min',
        props,
        values: 105,
      });
      expect(props.min).toEqual(-100);
    });
    test('correctMax', () => {
      let props = { ...defaultProps };
      utils.correctMax({
        key: 'max',
        props: props,
        values: 5,
      });
      expect(props.max).toEqual(100);
      props = { ...defaultProps };
      utils.correctMax({
        key: 'max',
        props: props,
        values: -5,
      });
      expect(props.max).toEqual(100);
    });
  });
});
