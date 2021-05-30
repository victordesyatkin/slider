import Example from './Example';

function importAll(resolve: __WebpackModuleApi.RequireContext) {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./', true, /^\.\/(?!.*(?:variables)).*\.scss$/));

function renderExample(this: HTMLElement): false | void {
  const example = new Example(this);
}

function renderComponent() {
  $('.js-example').each(renderExample);
}

$(renderComponent);
