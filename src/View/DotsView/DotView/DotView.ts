import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import orderBy from 'lodash.orderby';
import isUndefined from 'lodash.isundefined';

import PubSub from '../../../Pubsub';
import { objectToString, calcOffset } from '../../../helpers/utils';
import { ISubView } from '../../../interfaces';
import { DefaultProps, Addition } from '../../../types';

class DotView extends PubSub implements ISubView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement> | null;

  private addition: Addition;

  private parent?: JQuery<HTMLElement>;

  private isRendered = false;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  public setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
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
    if (this.props && !isUndefined(this.addition?.value)) {
      this.view = $('<div/>', this.prepareAttr());
      this.initHandles();
    }
  }

  private prepareAttr(): {
    class?: string;
    style?: string;
  } {
    const attr: { class?: string; style?: string } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
    return attr;
  }

  private prepareClassName(): string {
    const prefixClassName = this.props?.prefixClassName || '';
    const className = this.props?.dot?.className || '';
    const { value } = this.addition;
    let values = this.props?.values;
    let isActive = false;
    if (!isUndefined(values) && !isUndefined(value)) {
      if (values.length === 1) {
        isActive = value <= values[0];
      } else if (values.length > 1) {
        values = orderBy(values);
        if (value >= values[0] && value <= values[values.length - 1]) {
          isActive = true;
        }
      }
      return classnames(`${prefixClassName}__dot`, className, {
        [`${prefixClassName}__dot_active`]: isActive,
      });
    }
    return '';
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const value = this.addition?.value || 0;
      const style = this.props?.dot?.style || {};
      const { isVertical, min, max, isReverse } = this.props;
      const offset = calcOffset({ value, min, max, precision: 2 });
      const positionStyle = isVertical
        ? {
            [isReverse ? 'top' : 'bottom']: `${offset}%`,
            [isReverse ? 'bottom' : 'top']: 'auto',
            transform: isReverse ? 'none' : `translateY(+50%)`,
          }
        : {
            [isReverse ? 'right' : 'left']: `${offset}%`,
            [isReverse ? 'left' : 'right']: 'auto',
            transform: `translateX(${isReverse ? '+' : '-'}50%)`,
          };
      readyStyle = objectToString({
        ...style,
        ...positionStyle,
      });
      return readyStyle;
    }
    return readyStyle;
  }

  private updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  @bind
  private handleViewClick(event: JQuery.Event): void {
    if (this.view && this.props) {
      const { value, handles, index = 0 } = this.addition;
      const handleViewClick = handles?.handleViewClick;
      if (!isUndefined(value) && handleViewClick) {
        handleViewClick(index, event, value);
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

export default DotView;
