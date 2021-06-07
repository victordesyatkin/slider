import isString from 'lodash.isstring';
import trim from 'lodash.trim';

function importAll(resolve: __WebpackModuleApi.RequireContext): void {
  resolve.keys().forEach(resolve);
}

function prepareJSON<T>(json?: unknown): undefined | null | T {
  let result: undefined | null | T;
  if (!isString(json) || !trim(json)) {
    return result;
  }
  if (json) {
    try {
      result = JSON.parse(json) as undefined;
    } catch (error) {
      result = null;
    }
  }
  return result;
}

export { importAll, prepareJSON };
