/// <reference types="webpack-env" />
import { Render, Props, KeyProps } from '../../src/types';
declare function importAll(resolve: __WebpackModuleApi.RequireContext): void;
declare function prepareJSON<T>(json?: unknown): undefined | null | T;
declare function prepareFunction(string?: unknown): null | undefined | Render | string;
declare function prepareArray<T>(string?: unknown): T[] | null;
declare function valueToProp(options?: {
    value?: unknown;
    property?: string;
}): unknown;
declare function prepareValues(options?: Partial<{
    value: unknown;
    type: KeyProps;
    property: string;
    values: Props;
}>): Props | undefined;
declare function propsToValue(options?: Partial<{
    type: string;
    property: string;
    values: Props | null;
}>): unknown;
declare function checkedIsEqual(options?: {
    prev?: unknown | null;
    next?: unknown | null;
}): boolean;
export { importAll, prepareJSON, valueToProp, prepareArray, prepareFunction, prepareValues, propsToValue, checkedIsEqual, };
