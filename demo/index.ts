import Example from './Example';

function renderExample(this: HTMLElement): false | void {
  const example = new Example(this);
}

function renderComponent() {
  $('.js-example').each(renderExample);
}

$(renderComponent);
