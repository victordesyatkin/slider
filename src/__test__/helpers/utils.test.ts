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

    test('isVertical, HTMLElement -> getHandleCenterPosition -> number', () => {
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
    test('(isVertical: boolean, e: MouseEvent): number -> getMousePosition -> number', () => {
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
          props: { ...defaultProps, isVertical: true },
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
          props: { ...defaultProps, isVertical: true, isReverse: true },
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
          props: { ...defaultProps },
        })
      ).toBe(25);
      expect(
        utils.calcValue({
          offset: 50,
          length: 100,
          props: { ...defaultProps, isVertical: true },
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
          props: { ...defaultProps, isVertical: true },
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
        expect.objectContaining({
          ...defaultProps,
          mark: {
            ...defaultProps.mark,
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
          className: null,
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
          wrapClassName: null,
          style: null,
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
    test('correctStep', () => {
      let props = { ...defaultProps };
      utils.correctStep({
        key: 'step',
        props: props,
        values: 5,
      });
      expect(props.step).toEqual(0);
      props = { ...defaultProps };
      utils.correctStep({
        key: 'step',
        props: props,
        values: -5,
      });
      expect(props.step).toEqual(0);
      props = { ...defaultProps, max: -10, min: -50, step: 5 };
      utils.correctStep({
        key: 'step',
        props: props,
        values: -5,
      });
      expect(props.step).toEqual(0);
      props = { ...defaultProps, max: -10, min: -50, step: 6 };
      utils.correctStep({
        key: 'step',
        props,
        values: 10,
      });
      expect(props.step).toEqual(6);
    });
    test('correctPrecision', () => {
      let props = { ...defaultProps };
      utils.correctPrecision({
        key: 'precision',
        props: props,
        values: 4,
      });
      expect(props.precision).toEqual(0);
      props = { ...defaultProps };
      utils.correctPrecision({
        key: 'precision',
        props: props,
        values: -5,
      });
      expect(props.precision).toEqual(0);
    });
    test('correctIndent', () => {
      let props = { ...defaultProps };
      utils.correctIndent({
        key: 'indent',
        props: props,
        values: 4,
      });
      expect(props.precision).toEqual(0);
      props = { ...defaultProps };
      utils.correctIndent({
        key: 'indent',
        props: props,
        values: -5,
      });
      expect(props.precision).toEqual(0);
    });
    test('correctClassNames', () => {
      const values = {
        classNames: ['aaaa', false, true, [], 'bbbb', 4, 7, 0, {}],
      };
      utils.correctClassNames({
        key: 'classNames',
        value: values.classNames,
        values,
      });
      expect(values.classNames).toEqual(
        expect.arrayContaining(['aaaa', 'bbbb'])
      );
      const values1 = {
        classNames: false,
      };
      utils.correctClassNames({
        key: 'classNames',
        value: values1.classNames,
        values,
      });
      expect(values.classNames).toEqual(null);
    });
    test('isNeedCorrectStyle', () => {
      let isCorrect = utils.isNeedCorrectStyle({
        color: 'green',
      });
      expect(isCorrect).toEqual(false);
      isCorrect = utils.isNeedCorrectStyle([]);
      expect(isCorrect).toEqual(true);
      isCorrect = utils.isNeedCorrectStyle(4);
      expect(isCorrect).toEqual(true);
      isCorrect = utils.isNeedCorrectStyle(true);
      expect(isCorrect).toEqual(true);
      isCorrect = utils.isNeedCorrectStyle(false);
      expect(isCorrect).toEqual(true);
      isCorrect = utils.isNeedCorrectStyle({});
      expect(isCorrect).toEqual(true);
      isCorrect = utils.isNeedCorrectStyle('dddd');
      expect(isCorrect).toEqual(true);
    });

    test('correctStyles', () => {
      const values = {
        styles: [
          'aaaa',
          false,
          { 'font-size': '1rem' },
          true,
          [],
          'bbbb',
          4,
          {},
        ],
      };
      utils.correctStyles({
        key: 'styles',
        value: values.styles,
        values,
      });
      expect(values.styles).toEqual(
        expect.arrayContaining([{ 'font-size': '1rem' }])
      );
      const values1 = {
        styles: [],
      };
      utils.correctStyles({
        key: 'styles',
        value: values1.styles,
        values: values1,
      });
      expect(values1.styles).toEqual(null);
      const values2 = {
        styles: '',
      };
      utils.correctStyles({
        key: 'styles',
        value: values2.styles,
        values: values2,
      });
      expect(values2.styles).toEqual(null);
    });
    test('correctStyle', () => {
      const values = {
        style: { 'font-size': '1rem' },
      };
      utils.correctStyle({
        key: 'style',
        value: values.style,
        values,
      });
      expect(values.style).toEqual(
        expect.objectContaining({ 'font-size': '1rem' })
      );
      const values1 = {
        style: {},
      };
      utils.correctStyle({
        key: 'style',
        value: values1.style,
        values: values1,
      });
      expect(values1.style).toEqual(null);
      const values2 = {
        style: '',
      };
      utils.correctStyles({
        key: 'style',
        value: values2.style,
        values: values2,
      });
      const values3 = {
        style: 'aaaa',
      };
      utils.correctStyles({
        key: 'styles',
        value: values3.style,
        values: values3,
      });
      expect(values3.style).toEqual('aaaa');
    });
    test('correctClassName', () => {
      const values = {
        className: 'aaaa',
      };
      utils.correctClassName({
        key: 'className',
        value: values.className,
        values,
      });
      expect(values.className).toEqual('aaaa');
      const values1 = {
        className: '',
      };
      utils.correctClassName({
        key: 'className',
        value: values1.className,
        values: values1,
      });
      expect(values1.className).toEqual(null);
      const values2 = {
        className: {},
      };
      utils.correctClassName({
        key: 'className',
        value: values2.className,
        values: values2,
      });
      expect(values2.className).toEqual(null);
    });
    test('correctValues', () => {
      const values = {
        values: 'aaaa',
      };
      utils.correctValues({
        key: 'values',
        value: values.values,
        values,
        props: { ...defaultProps },
      });
      expect(values.values).toEqual([defaultProps.min, defaultProps.max]);
      const values1 = {
        values: ['aaaa'],
      };
      utils.correctValues({
        key: 'values',
        value: values1.values,
        values: values1,
        props: { ...defaultProps },
      });
      expect(values1.values).toEqual(expect.arrayContaining([0]));
      const values2 = {
        values: [-14],
      };
      utils.correctValues({
        key: 'values',
        value: values2.values,
        values: values2,
        props: { ...defaultProps },
      });
      expect(values2.values).toEqual(expect.arrayContaining([0]));
      const values3 = {
        values: [-14],
      };
      utils.correctValues({
        key: 'values',
        value: values3.values,
        values: values3,
        props: { ...defaultProps },
      });
      expect(values3.values).toEqual(expect.arrayContaining([0]));
      const values4 = {
        values: [-14],
      };
      utils.correctValues({
        key: 'style',
        value: values4.values,
        values: values4,
        props: { ...defaultProps },
      });
      expect(values4.values).toEqual(expect.arrayContaining([-14]));
      const values5 = {
        values: [7, false, 4],
      };
      utils.correctValues({
        key: 'values',
        value: values5.values,
        values: values5,
        props: { ...defaultProps },
      });
      expect(values5.values).toEqual(expect.arrayContaining([0, 4, 7]));
    });
    test('correctIndex', () => {
      const options = {
        key: 'index',
        values: 'aaaa',
        props: { ...defaultProps },
      };
      utils.correctIndex(options);
      expect(options.props).toEqual(
        expect.objectContaining({ ...defaultProps })
      );
      const options1 = {
        key: 'index',
        values: {},
        props: { ...defaultProps },
      };
      utils.correctIndex(options1);
      expect(options1.props).toEqual(
        expect.objectContaining({ ...defaultProps })
      );
      const options2 = {
        key: 'index',
        values: 7,
        props: { ...defaultProps },
      };
      utils.correctIndex(options2);
      expect(options2.props).toEqual(
        expect.objectContaining({ ...defaultProps })
      );
      const options3 = {
        key: 'index',
        values: -5,
        props: { ...defaultProps },
      };
      utils.correctIndex(options3);
      expect(options3.props).toEqual(
        expect.objectContaining({ ...defaultProps })
      );
      const options4 = {
        key: 'index',
        values: 1,
        props: { ...defaultProps, index: 1 },
      };
      utils.correctIndex(options4);
      expect(options4.props).toEqual(
        expect.objectContaining({ ...defaultProps, index: undefined })
      );
      const options5 = {
        key: 'index',
        values: 0,
        props: { ...defaultProps, index: 0 },
      };
      utils.correctIndex(options5);
      expect(options5.props).toEqual(
        expect.objectContaining({ ...defaultProps, index: 0 })
      );
    });
  });
});
