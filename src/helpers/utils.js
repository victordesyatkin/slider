"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProps = exports.getNearest = exports.getNearestIndex = exports.getPosition = exports.getHandleCenterPosition = exports.calcOffset = exports.ensureValueInRange = exports.getMousePosition = exports.getPrecision = exports.getClosestPoint = exports.ensureValuePrecision = exports.prepareValues = exports.getCount = exports.getSliderStart = exports.getSliderLength = exports.calcValue = exports.calcValueByPos = exports.checkNeighbors = exports.ensureValueCorrectNeighbors = exports.calcValueWithEnsure = exports.setFunctionGetBoundingClientRectHTMLElement = exports.prepareData = exports.uniqId = exports.objectToString = void 0;
const get_1 = __importDefault(require("lodash/get"));
const orderBy_1 = __importDefault(require("lodash.orderby"));
const merge_1 = __importDefault(require("lodash.merge"));
const uniq_1 = __importDefault(require("lodash.uniq"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const defaultProps = {
    prefixCls: 'fsd-slider',
    values: [0],
    min: 0,
    max: 100,
    disabled: false,
    track: { on: true },
    rail: { on: true },
    vertical: false,
    reverse: false,
    precision: 0,
    mark: { values: [] },
};
exports.defaultProps = defaultProps;
function objectToString(style) {
    if (!style) {
        return '';
    }
    const lines = Object.keys(style).map((property) => `${property}: ${style[property]};`);
    return lines.join('');
}
exports.objectToString = objectToString;
function calcOffset(value, min, max, precision) {
    const ratio = (value - min) / (max - min);
    return Number(Math.max(0, ratio * 100).toFixed(precision));
}
exports.calcOffset = calcOffset;
function getHandleCenterPosition(vertical, handle) {
    const coords = handle.getBoundingClientRect();
    return vertical
        ? coords.top + coords.height * 0.5
        : window.pageXOffset + coords.left + coords.width * 0.5;
}
exports.getHandleCenterPosition = getHandleCenterPosition;
function ensureValueInRange(value, { max, min }) {
    if (value <= min) {
        return min;
    }
    if (value >= max) {
        return max;
    }
    return value;
}
exports.ensureValueInRange = ensureValueInRange;
function getMousePosition(vertical, event) {
    const { clientY = 0, pageX = 0 } = event || {};
    return vertical ? clientY : pageX;
}
exports.getMousePosition = getMousePosition;
function getPrecision(step) {
    const stepString = step.toString();
    let precision = 0;
    if (stepString.indexOf('.') >= 0) {
        precision = stepString.length - 1 - stepString.indexOf('.');
    }
    return precision;
}
exports.getPrecision = getPrecision;
function getClosestPoint(value, { step, min, max }, props) {
    if (step) {
        let points = [...(props?.mark?.values || [])];
        const baseNum = 10 ** getPrecision(step);
        const maxSteps = Math.floor((max * baseNum - min * baseNum) / (step * baseNum));
        const steps = Math.min((value - min) / step, maxSteps);
        const closestStep = Math.round(steps) * step + min;
        points.push(closestStep);
        points = uniq_1.default(points);
        const diffs = points.map((point) => Math.abs(value - point));
        return points[diffs.indexOf(Math.min(...diffs))];
    }
    return value;
}
exports.getClosestPoint = getClosestPoint;
function ensureValuePrecision(value, props) {
    const { step, min, max } = props;
    const closestPoint = Number.isFinite(getClosestPoint(value, { step, min, max }, props))
        ? getClosestPoint(value, { step, min, max }, props)
        : 0;
    return isUndefined_1.default(step)
        ? closestPoint
        : parseFloat(closestPoint.toFixed(getPrecision(step)));
}
exports.ensureValuePrecision = ensureValuePrecision;
function checkNeighbors(value) {
    return value.length > 1;
}
exports.checkNeighbors = checkNeighbors;
function ensureValueCorrectNeighbors(options) {
    const { props, index } = options;
    const { indent, values } = props;
    let { min, max } = props;
    const { value } = options;
    if (checkNeighbors(values)) {
        const prevValue = get_1.default(values, [index - 1]);
        const nextValue = get_1.default(values, [index + 1]);
        if (!isUndefined_1.default(prevValue)) {
            min = indent ? prevValue + indent : prevValue;
        }
        if (!isUndefined_1.default(nextValue)) {
            max = indent ? nextValue - indent : nextValue;
        }
    }
    return ensureValueInRange(value, {
        min,
        max,
    });
}
exports.ensureValueCorrectNeighbors = ensureValueCorrectNeighbors;
function calcValueWithEnsure(options) {
    const { props } = options;
    let { value } = options;
    value = ensureValuePrecision(value, props);
    value = ensureValueCorrectNeighbors({ ...options, value });
    return value;
}
exports.calcValueWithEnsure = calcValueWithEnsure;
function prepareValues(props) {
    let { values } = props;
    const { mark } = props;
    values = orderBy_1.default(values).map((value, index) => calcValueWithEnsure({ value, props, index }));
    let markValues = (mark?.values || []).map((value) => ensureValueInRange(value, { min: props.min, max: props.max }));
    markValues = orderBy_1.default(uniq_1.default(markValues), [], ['asc']);
    return { ...props, values, mark: { ...mark, values: markValues } };
}
exports.prepareValues = prepareValues;
function getCount(props) {
    return get_1.default(props, ['values'], []).length;
}
exports.getCount = getCount;
function getSliderStart(options) {
    const { props, view } = options;
    if (props && view) {
        const { vertical, reverse } = props;
        const rect = view.get(0).getBoundingClientRect();
        if (vertical) {
            return reverse ? rect.bottom : rect.top;
        }
        return window.pageXOffset + (reverse ? rect.right : rect.left);
    }
    return 0;
}
exports.getSliderStart = getSliderStart;
function getSliderLength(options) {
    const { props, view } = options;
    if (props && view) {
        const { vertical } = props;
        const coords = view.get(0).getBoundingClientRect();
        return vertical ? coords.height : coords.width;
    }
    return 0;
}
exports.getSliderLength = getSliderLength;
function calcValue(options) {
    const { offset, length, props } = options;
    const { vertical, min, max, precision } = props;
    const ratio = Math.abs(Math.max(offset, 0) / length);
    const value = vertical
        ? (1 - ratio) * (max - min) + min
        : ratio * (max - min) + min;
    return Number(value.toFixed(precision));
}
exports.calcValue = calcValue;
function calcValueByPos(options) {
    const { position, props, start } = options;
    const { reverse, min, max } = props;
    const sign = reverse ? -1 : +1;
    const offset = sign * (position - start);
    let value = ensureValueInRange(calcValue({ ...options, offset }), {
        min,
        max,
    });
    value = calcValueWithEnsure({ ...options, value });
    return value;
}
exports.calcValueByPos = calcValueByPos;
function setFunctionGetBoundingClientRectHTMLElement(style) {
    const defaultStyle = {
        width: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
    };
    const { width, height, marginTop, marginLeft, marginBottom, marginRight } = {
        ...defaultStyle,
        ...style,
    };
    window.HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
        const domRect = {
            width: parseFloat(this.style.width) || width || 0,
            height: parseFloat(this.style.height) || height || 0,
            top: parseFloat(this.style.marginTop) || marginTop || 0,
            left: parseFloat(this.style.marginLeft) || marginLeft || 0,
            x: 0,
            y: 0,
            toJSON: () => { },
            bottom: parseFloat(this.style.marginBottom) || marginBottom || 0,
            right: parseFloat(this.style.marginRight) || marginRight || 0,
        };
        return domRect;
    };
}
exports.setFunctionGetBoundingClientRectHTMLElement = setFunctionGetBoundingClientRectHTMLElement;
function prepareData(props, prevProps) {
    const values = props?.values || prevProps?.values || defaultProps.values;
    const markValues = props?.mark?.values ||
        prevProps?.mark?.values ||
        defaultProps?.mark?.values;
    const mergeProps = merge_1.default({}, defaultProps, prevProps, props);
    return prepareValues({
        ...mergeProps,
        values,
        mark: { ...mergeProps?.mark, values: markValues },
    });
}
exports.prepareData = prepareData;
function uniqId() {
    return Math.random().toString(16).substr(2);
}
exports.uniqId = uniqId;
function getPosition({ vertical = false, coordinateX = 0, coordinateY = 0, }) {
    return vertical ? coordinateY : coordinateX;
}
exports.getPosition = getPosition;
function getNearest({ value, values, }) {
    let readyIndex = 0;
    let readyValue = values[0];
    let readyDifferent = Number.MAX_SAFE_INTEGER;
    values.forEach((item, index) => {
        const different = Math.abs(value - item);
        if (readyDifferent > different) {
            readyDifferent = different;
            readyIndex = index;
            readyValue = item;
        }
    });
    return { index: readyIndex, value: readyValue };
}
exports.getNearest = getNearest;
function getNearestIndex(options) {
    const { coordinateX, coordinateY, props, start } = options;
    const { reverse, min, max, values, vertical } = props;
    const position = getPosition({ vertical, coordinateX, coordinateY });
    const sign = reverse ? -1 : +1;
    const offset = sign * (position - start);
    const value = ensureValueInRange(calcValue({ ...options, offset }), {
        min,
        max,
    });
    const { index } = getNearest({ value, values });
    return index;
}
exports.getNearestIndex = getNearestIndex;
//# sourceMappingURL=utils.js.map