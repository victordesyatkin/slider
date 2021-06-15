import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';

import { ISubView } from '../../interfaces';
import PubSub from '../../Pubsub';
import { objectToString } from '../../helpers/utils';
import { DefaultProps, Addition } from '../../types';

export default class RailView extends PubSub implements ISubView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement> | null;

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
      this.view = null;
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
      const isOn = this.props?.rail?.isOn;
      if (isOn) {
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
    const prefixClassName = this.props?.prefixClassName || '';
    const className = this.props?.rail?.className || '';
    return classnames(`${prefixClassName}__rail`, className);
  }

  private prepareStyle(): string | undefined {
    const style = this.props?.rail?.style || {};
    return objectToString({
      ...style,
    });
  }

  private updateView(): void {
    if (this.view) {
      if (this.props?.rail?.isOn) {
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
      const handleViewClick = handles?.handleViewClick;
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
