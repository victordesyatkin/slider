import { DefaultProps, Props } from '../types';
declare const defaultProps: DefaultProps;
declare function objectToString(style?: {
    [key: string]: string;
}): string;
declare function calcOffset(value: number, min: number, max: number, precision?: number): number;
declare function getHandleCenterPosition(vertical: boolean, handle: HTMLElement): number;
declare function ensureValueInRange(value: number, { max, min }: {
    max: number;
    min: number;
}): number;
declare function getMousePosition(vertical: boolean, event: MouseEvent): number;
declare function getPrecision(step: number): number;
declare function getClosestPoint(value: number, { step, min, max }: {
    step: number | undefined;
    min: number;
    max: number;
}, props: DefaultProps): number;
declare function ensureValuePrecision(value: number, props: DefaultProps): number;
declare function checkNeighbors(value: number[]): boolean;
declare function ensureValueCorrectNeighbors(options: {
    value: number;
    props: DefaultProps;
    index: number;
}): number;
declare function calcValueWithEnsure(options: {
    value: number;
    props: DefaultProps;
    index: number;
}): number;
declare function prepareValues(props: DefaultProps): DefaultProps;
declare function getCount(props?: DefaultProps): number;
declare function getSliderStart(options: {
    props?: DefaultProps;
    view?: JQuery<HTMLElement> | null;
}): number;
declare function getSliderLength(options: {
    view?: JQuery<HTMLElement> | null;
    props?: DefaultProps;
}): number;
declare function calcValue(options: {
    offset: number;
    length: number;
    props: DefaultProps;
}): number;
declare function calcValueByPos(options: {
    position: number;
    start: number;
    props: DefaultProps;
    index: number;
    length: number;
}): number;
declare function setFunctionGetBoundingClientRectHTMLElement(style?: Partial<{
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
}>): void;
declare function correctMin(options: {
    key: string;
    props: DefaultProps;
    values: unknown;
}): void;
declare function correctMax(options: {
    key: string;
    props: DefaultProps;
    values: unknown;
}): void;
declare function correctStep(options: {
    key: string;
    props: DefaultProps;
    values: unknown;
}): void;
declare function correctPrecision(options: {
    key: string;
    props: DefaultProps;
    values: unknown;
}): void;
declare function correctIndent(options: {
    key: string;
    props: DefaultProps;
    values: unknown;
}): void;
declare function correctClassNames(options: {
    values?: Record<string, unknown>;
    key: string;
    value?: unknown;
}): void;
declare function isNeedCorrectStyle(style: unknown): boolean;
declare function correctStyles(options: {
    values?: Record<string, unknown>;
    key: string;
    value?: unknown;
}): void;
declare function correctStyle(options: {
    values?: Record<string, unknown>;
    key: string;
    value?: unknown;
}): void;
declare function correctClassName(options: {
    values?: Record<string, unknown>;
    key: string;
    value?: unknown;
}): void;
declare function correctValues(options: {
    values?: Record<string, unknown>;
    key: string;
    props: DefaultProps;
    value?: unknown;
}): void;
declare function correctIndex(options: {
    values?: unknown;
    key: string;
    props: DefaultProps;
}): void;
declare function correctRender(options: {
    values?: Record<string, unknown>;
    key: string;
    props: DefaultProps;
    value?: unknown;
}): void;
declare function correctSet(options: {
    key: string;
    props: DefaultProps;
    values: unknown;
}): void;
declare function correctData(props: DefaultProps): DefaultProps;
declare function prepareData(props?: Props): DefaultProps;
declare function uniqId(): string;
declare function getPosition({ vertical, coordinateX, coordinateY, }: {
    vertical: boolean;
    coordinateX: number;
    coordinateY: number;
}): number;
declare function isDirectionToMin(options: {
    value: number;
    props: DefaultProps;
    item: number;
}): boolean;
declare function getNearest({ value, values, props, }: {
    value: number;
    values: number[];
    props: DefaultProps;
}): {
    index: number;
    value: number;
};
declare function getNearestIndex(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    props: DefaultProps;
    length: number;
}): number;
declare function getCorrectIndex(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    props: DefaultProps;
    length: number;
    index?: number;
}): {
    isCorrect: boolean;
    index: number;
};
export { objectToString, uniqId, prepareData, setFunctionGetBoundingClientRectHTMLElement, calcValueWithEnsure, ensureValueCorrectNeighbors, checkNeighbors, calcValueByPos, calcValue, getSliderLength, getSliderStart, getCount, prepareValues, ensureValuePrecision, getClosestPoint, getPrecision, getMousePosition, ensureValueInRange, calcOffset, getHandleCenterPosition, getPosition, getNearestIndex, getNearest, defaultProps, getCorrectIndex, isDirectionToMin, correctData, correctSet, correctMin, correctMax, correctStep, correctPrecision, correctIndent, correctClassNames, isNeedCorrectStyle, correctStyles, correctStyle, correctClassName, correctValues, correctIndex, correctRender, };
