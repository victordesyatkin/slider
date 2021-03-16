import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import uniq from 'lodash.uniq';
import orderBy from 'lodash.orderby';
import isUndefined from 'lodash.isundefined';

import PubSub from '../../Pubsub';
import { ISubView } from '../../interfaces';
import { DefaultProps, Addition } from '../../types';
import MarkView from '../MarkView';

export default class MarksView extends PubSub implements ISubView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement>;

  private addition: Addition;

  private marks: ISubView[] = [];

  private isRendered = false;

  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  public setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
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

  public remove(): void {
    if (this.view) {
      this.view.remove();
      this.view = undefined;
      this.marks = [];
      this.isRendered = false;
    }
  }

  private static cleanSubView(views: ISubView[], count: number): void {
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

  public getAddition(): Addition {
    return this.addition;
  }

  public setAddition(addition: Addition): void {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      const on = this.props?.mark?.on;
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
    const prefixCls = this.props?.prefixCls || '';
    const className = this.props?.mark?.wrapClassName;
    return classnames(`${prefixCls}__marks`, className);
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
      if (this.props?.mark?.on) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  private createOrUpdateSubViews(): void {
    this.marks = this.createOrUpdateSubView<MarkView>(this.marks, MarkView);
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    SubView: { new (addition: Addition): T }
  ): ISubView[] {
    const readyViews = [...views];
    if (this.props && this.view) {
      const { min, max, step, reverse } = this.props;
      let values: number[] = [];
      const markValues = this.props?.mark?.values;
      if (Array.isArray(markValues)) {
        values = [...markValues];
      }
      if (step) {
        for (let index = min; index <= max; index += step) {
          values.push(index);
        }
      }
      values = orderBy(uniq(values), [], reverse ? 'desc' : 'asc');
      const { length } = values;
      const { handles } = this.addition;
      for (let index = 0; index < length; index += 1) {
        if (!isUndefined(readyViews[index])) {
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
      MarksView.cleanSubView(readyViews, values.length);
    }
    return readyViews;
  }

  private appendSubViews(): void {
    if (this.view) {
      this.marks.forEach(this.appendSubView);
    }
  }

  @bind
  private appendSubView(subView: ISubView): void {
    if (this.view) {
      subView.render(this.view);
    }
  }
}
