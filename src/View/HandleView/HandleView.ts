import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import isUndefined from 'lodash.isundefined';

import PubSub from '../../Pubsub';
import { calcOffset, objectToString } from '../../helpers/utils';
import { ISubView } from '../../interfaces';
import { DefaultProps, Addition } from '../../types';
import TooltipView from '../TooltipView';

export default class HandleView extends PubSub implements ISubView {
  private addition: Addition;

  private props?: DefaultProps;

  private view?: JQuery<HTMLElement>;

  private isRendered = false;

  private parent?: JQuery<HTMLElement>;

  private tooltip?: TooltipView;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  public setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
    this.appendTooltip();
    this.render();
  }

  public getProps(): DefaultProps | undefined {
    return this.props;
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
      this.view = $('<div/>', this.prepareAttr());
      this.initHandles();
    }
  }

  @bind
  private handleViewMouseDown(event: JQuery.Event): void {
    const handleViewMouseDown = this.addition?.handles?.handleViewMouseDown;
    const index = this.addition?.index;
    if (!isUndefined(index) && handleViewMouseDown) {
      handleViewMouseDown(index, event);
    }
  }

  private prepareAttr(): {
    class: string | undefined;
    style: string | undefined;
    tabindex: number;
  } {
    const attr: {
      class: string | undefined;
      style: string | undefined;
      tabindex: number;
    } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
      tabindex: -1,
    };
    return attr;
  }

  private prepareClassName(): string {
    const prefixCls = this.props?.prefixCls || '';
    const index = this.addition?.index;
    const className = this.props?.handle?.classNames?.[index] || '';
    const active = this.addition?.active;
    return classnames(`${prefixCls}__handle`, className, {
      [`${prefixCls}__handle_active`]: active,
    });
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const index = this.addition?.index;
      const style = this.props?.handle?.styles?.[index] || {};
      const { values, min, max, vertical, reverse } = this.props;
      const value = values[index];
      const offset = calcOffset(value, min, max, 2);
      const positionStyle = vertical
        ? {
            [reverse ? 'top' : 'bottom']: `${offset}%`,
            [reverse ? 'bottom' : 'top']: 'auto',
            transform: reverse ? 'none' : `translateY(+50%)`,
          }
        : {
            [reverse ? 'right' : 'left']: `${offset}%`,
            [reverse ? 'left' : 'right']: 'auto',
            transform: `translateX(${reverse ? '+' : '-'}50%)`,
          };
      readyStyle = objectToString({
        ...style,
        ...positionStyle,
        'z-index': `${index + 10}`,
      });
    }
    return readyStyle;
  }

  private isProps(): boolean {
    return !!(this.view && this.props);
  }

  private appendTooltip(): void {
    const on = this.props?.tooltip?.on;
    if (on && this.isProps()) {
      const index = this.addition?.index;
      const value = this.props?.values?.[index];
      if (!isUndefined(value)) {
        if (this.tooltip) {
          this.tooltip.setAddition({ value, index });
          if (this.props) {
            this.tooltip.setProps(this.props);
          }
        } else {
          this.tooltip = new TooltipView({ value, index });
          if (this.props) {
            this.tooltip.setProps(this.props);
          }
          this.tooltip.render(this.view);
        }
      }
    } else if (this.tooltip && this.view) {
      this.tooltip.remove();
      this.tooltip = undefined;
      this.view.empty();
    }
  }

  private updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  private initHandles(): void {
    if (this.view) {
      this.view.off({
        mousedown: this.handleViewMouseDown,
      });
      this.view.on({
        mousedown: this.handleViewMouseDown,
      });
    }
  }
}
