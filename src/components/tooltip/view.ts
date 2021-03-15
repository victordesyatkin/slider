import $ from 'jquery';
import classnames from 'classnames';
import isUndefined from 'lodash.isundefined';

import PubSub from '../../helpers/pubsub';
import { objectToString } from '../../helpers/utils';
import { ISubView } from '../../Slider/interface';
import { DefaultProps, Addition } from '../../types';

export default class TooltipView extends PubSub implements ISubView {
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
    this.prepareContent();
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
    if (this.props && !isUndefined(this.addition?.value)) {
      this.view = $('<div/>', this.prepareAttr());
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
    const className = this.props?.tooltip?.className || '';
    const always = this.props?.tooltip?.always;

    return classnames(`${prefixCls}__tooltip`, className, {
      [`${prefixCls}__tooltip_always`]: always,
    });
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const style = this.props?.tooltip?.style || {};
      const positionStyle = {};
      readyStyle = objectToString({
        ...style,
        ...positionStyle,
      });
    }
    return readyStyle;
  }

  private prepareContent(): void {
    if (this.view) {
      const { value } = this.addition;
      if (!isUndefined(value)) {
        const render = this.props?.tooltip?.render;
        let content:
          | string
          | HTMLElement
          | JQuery<HTMLElement>
          | JQuery<HTMLElement>[]
          | HTMLElement[]
          | undefined = `${value}`;
        if (render) {
          content = render(value);
        }
        if (content) {
          this.view.empty().append(content);
        }
      }
    }
  }

  private updateView(): void {
    if (this.view) {
      if (this.props?.tooltip?.on) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }
}
