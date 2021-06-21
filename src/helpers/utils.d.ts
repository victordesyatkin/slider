import { DefaultProps, Props, Style, Track, Rail, Dot, Mark, Tooltip, Handle, Render } from '../types';
declare const defaultProps: DefaultProps;
declare function objectToString(style?: {
    [key: string]: string;
}): string;
declare function calcOffset(options: {
    value: number;
    min: number;
    max: number;
    precision?: number;
}): number;
declare function getHandleCenterPosition(options: {
    isVertical: boolean;
    handle: HTMLElement;
}): number;
declare function ensureValueInRange(options: {
    value: number;
    max: number;
    min: number;
}): number;
declare function getMousePosition(options: {
    isVertical: boolean;
    event: MouseEvent;
}): number;
declare function getPrecision(step: number): number;
declare function getClosestPoint(options: {
    value: number;
    step: number;
    min: number;
    max: number;
    extraValues: number[] | undefined | null;
}): number;
declare function checkIsCorrectStep(step: number | undefined): boolean;
declare function ensureValuePrecision(options: {
    value: number;
    max: number;
    min: number;
    step: number | undefined;
    extraValues: number[] | undefined | null;
}): number;
declare function checkNeighbors(value: number[]): boolean;
declare function ensureValueCorrectNeighbors(options: {
    value: number;
    min: number;
    max: number;
    index: number;
    values: number[];
    indent: number;
}): number;
declare function calcValueWithEnsure(options: {
    value: number;
    min: number;
    max: number;
    values: number[];
    indent: number;
    index: number;
    step: number | undefined;
    extraValues: number[] | undefined | null;
}): number;
declare function prepareValues(props: DefaultProps): DefaultProps;
declare function getSliderStart(options?: Partial<{
    isVertical: boolean;
    isReverse: boolean;
    view: JQuery<HTMLElement> | null;
}>): number;
declare function getSliderLength(options: {
    view?: JQuery<HTMLElement> | null;
    isVertical?: boolean;
}): number;
declare function calcValue(options: {
    offset: number;
    length: number;
    isVertical: boolean;
    min: number;
    max: number;
    step: number | undefined;
}): number;
declare function calcValueByPos(options: {
    position: number;
    start: number;
    index: number;
    length: number;
    isVertical: boolean;
    isReverse: boolean;
    min: number;
    max: number;
    step: number | undefined;
    indent: number;
    values: number[];
    extraValues: number[] | undefined | null;
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
    max: number;
    min: number;
}): number;
declare function correctMax(options: {
    min: number;
    max: number;
}): number;
declare function correctStep(options: {
    min: number;
    max: number;
    step: number | undefined | null;
}): number;
declare function correctPrecision(options: {
    precision: number;
}): number;
declare function correctIndent(options: {
    indent: number;
    values: number[];
    max: number;
}): number;
declare function correctClassNames(options?: Partial<{
    classNames: string[] | null;
}>): string[] | null;
declare function isNeedCorrectStyle(style: Style | null): boolean;
declare function correctStyles(options?: Partial<{
    styles: Style[] | null;
}>): Style[] | null;
declare function correctStyle(options?: Partial<{
    style: Style | null;
}>): Style | null;
declare function correctClassName(options?: Partial<{
    className: string | null;
}>): string | null;
declare function correctWrapClassName(options?: Partial<{
    wrapClassName: string | null;
}>): string | null;
declare function correctValues(options?: Partial<{
    values?: number[] | null;
    min: number;
    max: number;
}>): number[] | null;
declare function correctIndex(options?: Partial<{
    index: number | null;
    values: number[] | null;
}>): number | undefined;
declare function correctRender(options?: Partial<{
    render: Render | null;
}>): Render | null;
declare function correctIsOn(options?: Partial<{
    isOn?: boolean;
}>): boolean;
declare function correctWithDot(options?: Partial<{
    withDot?: boolean;
}>): boolean;
declare function correctIsAlways(options?: Partial<{
    isAlways?: boolean;
}>): boolean;
declare function correctTrack(options?: Partial<{
    entity: Track;
}>): Track | undefined;
declare function correctHandle(options?: Partial<{
    entity: Handle;
}>): Handle | undefined;
declare function correctMark(options?: Partial<{
    entity: Mark;
    min: number;
    max: number;
}>): Mark | undefined;
declare function correctDot(options?: Partial<{
    entity: Dot;
}>): Dot | undefined;
declare function correctTooltip(options?: Partial<{
    entity: Tooltip;
}>): Tooltip | undefined;
declare function correctRail(options?: Partial<{
    entity: Rail;
}>): Rail | undefined;
declare function correctData(props: DefaultProps): DefaultProps;
declare function prepareData(props?: Props): DefaultProps;
declare function uniqId(): string;
declare function getPosition({ isVertical, coordinateX, coordinateY, }: {
    isVertical: boolean;
    coordinateX: number;
    coordinateY: number;
}): number;
declare function isDirectionToMin(options: {
    value: number;
    item: number;
}): boolean;
declare function getNearest({ value, values, }: {
    value: number;
    values: number[];
}): {
    index: number;
    value: number;
};
declare function getNearestIndex(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    length: number;
    isVertical: boolean;
    min: number;
    max: number;
    step: number | undefined;
    values: number[];
    isReverse: boolean;
}): number;
declare function getCorrectIndex(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    length: number;
    index?: number;
    isVertical: boolean;
    min: number;
    max: number;
    step: number | undefined;
    values: number[];
    isReverse: boolean;
}): {
    isCorrect: boolean;
    index: number;
};
export { objectToString, uniqId, prepareData, setFunctionGetBoundingClientRectHTMLElement, calcValueWithEnsure, ensureValueCorrectNeighbors, checkNeighbors, calcValueByPos, calcValue, getSliderLength, getSliderStart, prepareValues, ensureValuePrecision, getClosestPoint, getPrecision, getMousePosition, ensureValueInRange, calcOffset, getHandleCenterPosition, getPosition, getNearestIndex, getNearest, defaultProps, getCorrectIndex, isDirectionToMin, isNeedCorrectStyle, checkIsCorrectStep, correctData, correctMin, correctMax, correctStep, correctPrecision, correctIndent, correctClassNames, correctStyles, correctStyle, correctClassName, correctValues, correctIndex, correctRender, correctDot, correctMark, correctTooltip, correctHandle, correctRail, correctTrack, correctIsAlways, correctIsOn, correctWithDot, correctWrapClassName, };
