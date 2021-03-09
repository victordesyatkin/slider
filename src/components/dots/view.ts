import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import orderBy from 'lodash/orderBy';
import isArray from 'lodash/isArray';

import PubSub from '../../helpers/pubsub';
import { ISubView, IView } from '../../slider/interface';
import { DefaultProps, Addition } from '../../types';
import DotView from '../dot/view';

export default class DotsView extends PubSub implements ISubView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement>;

  private addition: Addition;

  private dots: ISubView[] = [];

  private parent?: JQuery<HTMLElement>;

  private isRendered = false;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  public render(parent?: JQuery<HTMLElement>): void {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered) {
      if (this.parent && this.view) {
        this.parent.append(this.view);
        this.isRendered = true;
      }
    }
  }

  public setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
  }

  public remove(): void {
    if (this.view) {
      this.view.remove();
      this.view = undefined;
      this.dots = [];
      this.isRendered = false;
    }
  }

  public getAddition(): Addition {
    return this.addition;
  }

  public setAddition(addition: Addition): void {
    this.addition = addition;
  }

  private static cleanSubView(views: IView[], count: number): void {
    const { length } = views;
    if (length > count) {
      for (let i = count; i < length; i += 1) {
        if (views[i]) {
          views[i].remove();
        }
      }
      views.splice(count);
    }
  }

  private createView(): void {
    if (this.props) {
      const on = this.props?.dot?.on;
      if (on) {
        this.view = $('<div/>', this.prepareAttr());
      }
    }
  }

  private prepareAttr(): {
    class: string | undefined;
    style: string | undefined;
  } {
    const attr: { class: string | undefined; style: string | undefined } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
    return attr;
  }

  private prepareClassName(): string {
    const prefixCls = get(this.props, ['prefixCls'], '');
    const className = this.props?.dot?.wrapClassName;
    const vertical = get(this.props, ['vertical']);
    return classnames(`${prefixCls}__dots`, className, {
      [`${prefixCls}__dots_vertical`]: vertical,
    });
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      readyStyle = '';
    }
    return readyStyle;
  }

  private updateView(): void {
    if (this.view) {
      if (get(this.props, ['dot', 'on'])) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  private createOrUpdateSubViews(): void {
    this.dots = this.createOrUpdateSubView<DotView>(this.dots, DotView);
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    SubView: { new (addition: Addition): T }
  ): ISubView[] {
    const readyViews = [...views];
    if (this.props && this.view) {
      const { min, max, step, reverse } = this.props;
      let values: number[] = [];
      const on = this.props?.mark?.dot;
      if (on) {
        const markValues = this.props?.mark?.values;
        if (isArray(markValues)) {
          values = [...markValues];
        }
      }
      if (step) {
        for (let i = min; i <= max; i += step) {
          values.push(i);
        }
      }
      const { handles } = this.addition;
      values = orderBy(uniq(values), [], reverse ? 'desc' : 'asc');
      const { length } = values;
      for (let i = 0; i < length; i += 1) {
        if (readyViews[i]) {
          readyViews[i].setAddition({ index: i, handles, value: values[i] });
          readyViews[i].setProps(this.props);
        } else {
          readyViews[i] = new SubView({ index: i, handles, value: values[i] });
          readyViews[i].setProps(this.props);
        }
      }
      DotsView.cleanSubView(readyViews, values.length);
    }
    return readyViews;
  }

  private appendSubViews(): void {
    if (this.view) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.dots.forEach(this.appendSubView);
    }
  }

  @bind
  private appendSubView(subView: IView): void {
    if (this.view) {
      subView.render(this.view);
    }
  }
}
