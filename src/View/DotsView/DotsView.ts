import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import uniq from 'lodash.uniq';
import orderBy from 'lodash.orderby';

import PubSub from '../../Pubsub';
import { ISubView, IView } from '../../interfaces';
import { DefaultProps, Addition } from '../../types';
import DotView from './DotView/DotView';

export default class DotsView extends PubSub implements ISubView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement> | null;

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
      this.view = null;
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
      for (let index = count; index < length; index += 1) {
        if (views[index]) {
          views[index].remove();
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
    const { prefixCls = '', vertical } = this.props || {};
    const className = this.props?.dot?.wrapClassName;
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
      if (this.props?.dot?.on) {
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
        if (Array.isArray(markValues)) {
          values = [...markValues];
        }
      }
      if (step) {
        for (let index = min; index <= max; index += step) {
          values.push(index);
        }
      }
      const { handles } = this.addition;
      values = orderBy(uniq(values), [], reverse ? 'desc' : 'asc');
      const { length } = values;
      for (let index = 0; index < length; index += 1) {
        if (readyViews[index]) {
          readyViews[index].setAddition({
            index,
            handles,
            value: values[index],
          });
          readyViews[index].setProps(this.props);
        } else {
          readyViews[index] = new SubView({
            index,
            handles,
            value: values[index],
          });
          readyViews[index].setProps(this.props);
        }
      }
      DotsView.cleanSubView(readyViews, values.length);
    }
    return readyViews;
  }

  private appendSubViews(): void {
    if (this.view) {
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
