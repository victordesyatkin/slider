import Example from './Example';

function renderExample(this: HTMLElement): false | void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const example = new Example(this);
}

function renderComponent() {
  $('.js-example').each(renderExample);
}

$(renderComponent);
