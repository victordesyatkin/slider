import $ from 'jquery';
import classnames from 'classnames';
import bind from 'bind-decorator';
import isUndefined from 'lodash.isundefined';

import PubSub from '../../../Pubsub';
import {
  objectToString,
  calcOffset,
  getPrecision,
} from '../../../helpers/utils';
import { ISubView } from '../../../interfaces';
import { DefaultProps, Addition } from '../../../types';

class MarkView extends PubSub implements ISubView {
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
    const className = this.props?.mark?.className || '';
    return classnames(`${prefixClassName}__mark`, className);
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const value = this.addition?.value || 0;
      const style = this.props?.mark?.style || {};
      const { vertical, min, max, reverse } = this.props;
      const offset = calcOffset(value, min, max, 2);
      const positionStyle = vertical
        ? {
            [reverse ? 'top' : 'bottom']: `${offset}%`,
            [reverse ? 'bottom' : 'top']: 'auto',
            transform: reverse ? 'translateY(-25%)' : `translateY(+50%)`,
          }
        : {
            [reverse ? 'right' : 'left']: `${offset}%`,
            [reverse ? 'left' : 'right']: 'auto',
            transform: `translateX(${reverse ? '+' : '-'}50%)`,
          };
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
        const render = this.props?.mark?.render;
        const { step, precision } = this.props || {};
        const readyPrecision = step ? getPrecision(step) : precision;
        let content:
          | string
          | HTMLElement
          | JQuery<HTMLElement>
          | JQuery<HTMLElement>[]
          | HTMLElement[]
          | undefined = `${value.toFixed(readyPrecision)}`;
        if (render) {
          content = render(value);
        }
        if (content) {
          this.view.empty().append(content);
        }
      }
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

  private updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }
}

export default MarkView;
