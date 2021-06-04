import $ from 'jquery';
import classnames from 'classnames';
import isUndefined from 'lodash.isundefined';

import { objectToString, calcOffset } from '../../helpers/utils';
import PubSub from '../../Pubsub';
import { ISubView } from '../../interfaces';
import { DefaultProps, Addition } from '../../types';

export default class TrackView extends PubSub implements ISubView {
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
    if (this.props && !isUndefined(this.addition?.index)) {
      const on = this.props?.track?.on;
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
    const index = this.addition?.index;
    const className = this.props?.track?.classNames || '';
    return classnames(
      `${prefixCls}__track`,
      { [`${prefixCls}__track-${index}`]: true },
      className
    );
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const index = this.addition?.index;
      const style = this.props?.track?.styles?.[index] || {};
      const { vertical, min, max } = this.props;
      let { reverse } = this.props;
      const { values, startPoint } = this.props;
      const readyOffset = calcOffset(values[index], min, max, 2);
      let offset = readyOffset;
      let length;
      if (values.length > 1) {
        length = calcOffset(values[index + 1], min, max, 2) - readyOffset;
      } else {
        const trackOffset =
          startPoint !== undefined ? calcOffset(startPoint, min, max, 2) : 0;
        offset = trackOffset;
        length = readyOffset - trackOffset;
      }
      if (length < 0) {
        reverse = !reverse;
        length = Math.abs(length);
        offset = 100 - offset;
      }
      const positionStyle = vertical
        ? {
            [reverse ? 'top' : 'bottom']: `${offset}%`,
            [reverse ? 'bottom' : 'top']: 'auto',
            height: `${length}%`,
          }
        : {
            [reverse ? 'right' : 'left']: `${offset}%`,
            [reverse ? 'left' : 'right']: 'auto',
            width: `${length}%`,
          };
      readyStyle = objectToString({
        ...positionStyle,
        ...style,
      });
    }
    return readyStyle;
  }

  private updateView(): void {
    if (this.view) {
      if (this.props?.track?.on) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }
}
