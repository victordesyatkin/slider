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
      const isOn = this.props?.track?.isOn;
      if (isOn) {
        this.view = $('<div/>', this.prepareAttr());
      }
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
    const index = this.addition?.index;
    const className = this.props?.track?.classNames?.[index] || '';
    return classnames(`${prefixClassName}__track`, className);
  }

  private prepareStyle(): string | undefined {
    let readyStyle: string | undefined;
    if (this.props) {
      const index = this.addition?.index;
      const style = this.props?.track?.styles?.[index] || {};
      const { isVertical, min, max } = this.props;
      let { isReverse } = this.props;
      const { values } = this.props;
      const readyOffset = calcOffset({
        value: values[index],
        min,
        max,
        precision: 2,
      });
      let offset = readyOffset;
      let length;
      if (values.length > 1) {
        length =
          calcOffset({ value: values[index + 1], min, max, precision: 2 }) -
          readyOffset;
      } else {
        const trackOffset = 0;
        offset = trackOffset;
        length = readyOffset - trackOffset;
      }
      if (length < 0) {
        isReverse = !isReverse;
        length = Math.abs(length);
        offset = 100 - offset;
      }
      const positionStyle = isVertical
        ? {
            [isReverse ? 'top' : 'bottom']: `${offset}%`,
            [isReverse ? 'bottom' : 'top']: 'auto',
            height: `${length}%`,
          }
        : {
            [isReverse ? 'right' : 'left']: `${offset}%`,
            [isReverse ? 'left' : 'right']: 'auto',
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
      if (this.props?.track?.isOn) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }
}
