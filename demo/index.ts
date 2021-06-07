import isObject from 'lodash.isobject';

import { ExampleProps } from './modules/types';
import Example from './components/example';
import { importAll } from './helpers';
import data from './data.json';

importAll(require.context('./', true, /^\.\/(?!.*(?:variables)).*\.scss$/));

function renderExample(this: HTMLElement, index: number): false | void {
  if (isObject(data)) {
    const { examples } = data || {};
    if (Array.isArray(examples) && examples[index]) {
      const props = examples[index] as ExampleProps;
      const example = new Example({
        parent: this,
        props,
      });
    }
  }
}

function renderComponent() {
  $('.js-example-wrapper').each(renderExample);
}

$(renderComponent);
