import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';

import PubSub from '../../helpers/pubsub';
import { calcOffset, objectToString } from '../../helpers/utils';
import { ISubView } from '../../slider/interface';
import { DefaultProps, Addition } from '../../types';
import TooltipView from '../tooltip/view';

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
  private handleViewMouseDown(event: MouseEvent): void {
    const handleViewMouseDown = this.addition?.handles?.handleViewMouseDown;
    const index = get(this.addition, ['index']);
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
    const prefixCls = get(this.props, ['prefixCls'], '');
    const index = get(this.addition, ['index']);
    const className = this.props?.handle?.classNames?.[index] || '';
    const active = get(this.addition, ['active']);
    return classnames(`${prefixCls}__handle`, className, {
      [`${prefixCls}__handle_active`]: active,
    });
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const index = get(this.addition, ['index']);
      const style = this.props?.handle?.styles?.[index] || {};
      const { values, min, max, vertical, reverse } = this.props;
      const value = values[index];
      const offset = calcOffset(value, min, max);
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
      const index = get(this.addition, ['index']);
      const value = get(this.props, ['values', index]);
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
        // eslint-disable-next-line @typescript-eslint/unbound-method
        mousedown: this.handleViewMouseDown,
      });
      this.view.on({
        // eslint-disable-next-line @typescript-eslint/unbound-method
        mousedown: this.handleViewMouseDown,
      });
    }
  }
}
