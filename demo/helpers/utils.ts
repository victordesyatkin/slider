import bind from 'bind-decorator';
import isString from 'lodash.isstring';
import trim from 'lodash.trim';

import { ComponentProps } from '../modules/types';

class Component<T> {
  constructor(options?: ComponentProps) {
    this.options = options;
    const { props, parent } = this.options || {};
    this.parent = parent;
    this.props = props as T;
  }

  public query?: string;

  public className?: string;

  public parent?: HTMLElement | JQuery<HTMLElement> | null;

  public $element?: JQuery<HTMLElement>;

  public element?: HTMLElement | null;

  public options?: ComponentProps;

  public props?: T;

  @bind
  public getElement(): HTMLElement | JQuery<HTMLElement> | null | undefined {
    return this.$element;
  }

  @bind
  public renderComponent(): void {
    const { query, className } = this.options || {};
    this.query = query || this.query;
    this.className = className || this.className;
    const isCorrect =
      this.isValidQuery() &&
      this.query &&
      typeof this.query === 'string' &&
      this.parent;
    if (!isCorrect) {
      return undefined;
    }
    if (this.parent && typeof this.query === 'string') {
      const $element = $(this.query, this.parent);
      if (!$element.length) {
        return undefined;
      }
      const element = $element.get(0);
      if (!element) {
        return undefined;
      }
      this.element = element;
      this.$element = $(element);
      if (this.$element.data(this.constructor.name)) {
        return undefined;
      }
      this.$element.data(this.constructor.name, this);
      if (this.init) {
        this.init();
      }
    }
    return undefined;
  }

  private isValidQuery(): boolean {
    return Boolean(this.query && isString(this.query) && trim(this.query));
  }

  public init(): void {
    this.getElement();
  }
}

export default Component;
