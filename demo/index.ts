import Example from './components/example';

function importAll(resolve: __WebpackModuleApi.RequireContext) {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./', true, /^\.\/(?!.*(?:variables)).*\.scss$/));

function renderExample(this: HTMLElement): false | void {
  const example = new Example(this);
}

function renderComponent() {
  $('.js-example-wrapper').each(renderExample);
}

$(renderComponent);
