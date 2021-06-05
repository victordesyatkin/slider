class Input {
  constructor(props?: {
    parent?: HTMLElement | JQuery<HTMLElement> | null;
    value: unknown;
  }) {
    this.init(props);
  }

  public setValue(value: unknown): void {
    this.$input?.val(String(value));
  }

  public getValue(): string | number | string[] | undefined {
    return this.$input?.val();
  }

  private $element?: JQuery<HTMLElement> | null;

  private $input?: JQuery<HTMLElement> | null;

  private static className = 'input';

  private static query = `.js-${Input.className}`;

  private init(props?: {
    parent?: HTMLElement | JQuery<HTMLElement> | null;
    value: unknown;
  }) {
    if (props) {
      const { parent, value = '' } = props;
      if (parent) {
        this.$element = $(Input.query, parent);
        this.$input = $(`${Input.query}__input`, this.$element);
        this.$input.val(String(value));
      }
    }
  }
}

export default Input;
