import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import get from 'lodash/get';

import { ISubView } from '../../slider/interface';
import PubSub from '../../helpers/pubsub';
import { objectToString } from '../../helpers/utils';
import { DefaultProps, Addition } from '../../types';

export default class RailView extends PubSub implements ISubView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement>;

  private addition: Addition;

  private isRendered = false;

  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  public setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
    this.initHandles();
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
      this.isRendered = false;
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
      const on = this.props?.rail?.on;
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
    const className = this.props?.rail?.className || '';
    return classnames(`${prefixCls}__rail`, className);
  }

  private prepareStyle(): string | undefined {
    const style = this.props?.rail?.style || {};
    return objectToString({
      ...style,
    });
  }

  private updateView(): void {
    if (this.view) {
      if (get(this.props, ['rail', 'on'])) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  @bind
  private handleViewClick(event: JQuery.Event): void {
    if (this.view && this.props) {
      const { handles, index = 0 } = this.addition;
      const handleViewClick = get(handles, ['handleViewClick']);
      if (handleViewClick) {
        handleViewClick(index, event);
      }
    }
  }

  private initHandles(): void {
    if (this.view) {
      this.view.off('click', this.handleViewClick);
      this.view.on('click', this.handleViewClick);
    }
  }
}
