import $ from "jquery";
import get from "lodash/get";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import { calcOffset } from "../../helpers/utils";
import classnames from "classnames";

export default class TrackView implements ISubView {
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: tAddition;

  constructor(addition: tAddition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      const on = get(this.props, ["track", "on"]);
      if (on) {
        this.view = $("<div/>", this.prepareAttr());
      }
    }
  }

  private prepareAttr = (): {
    class: string | undefined;
    style: string | undefined;
  } => {
    const attr: { class: string | undefined; style: string | undefined } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
    return attr;
  };

  private prepareClassName = (): string => {
    const prefixCls = get(this.props, ["prefixCls"], "");
    const index = get(this.addition, ["index"]);
    const className = get(this.props, ["track", "classNames", index], "");
    return classnames(
      `${prefixCls}__track`,
      { [`${prefixCls}__track-${index}`]: true },
      className
    );
  };

  private prepareStyle = (): string | undefined => {
    if (this.props) {
      const index = get(this.addition, ["index"]);
      const style = get(this.props, ["track", "styles", index], {});
      const { vertical, min, max } = this.props;
      let { reverse, values, startPoint } = this.props;
      let hoffset = calcOffset(values[index], min, max);
      let offset = hoffset;
      let length;
      if (values.length > 1) {
        length = calcOffset(values[index + 1], min, max) - hoffset;
      } else {
        const trackOffset =
          startPoint !== undefined ? calcOffset(startPoint, min, max) : 0;
        offset = trackOffset;
        length = hoffset - trackOffset;
      }
      if (length < 0) {
        reverse = !reverse;
        length = Math.abs(length);
        offset = 100 - offset;
      }
      const positonStyle = vertical
        ? {
            [reverse ? "top" : "bottom"]: `${offset}%`,
            [reverse ? "bottom" : "top"]: "auto",
            height: `${length}%`,
          }
        : {
            [reverse ? "right" : "left"]: `${offset}%`,
            [reverse ? "left" : "right"]: "auto",
            width: `${length}%`,
          };
      return objectToString({
        ...positonStyle,
        ...style,
      });
    }
  };

  private updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  public setProps = (props: tDefaultProps): void => {
    this.props = props;
    this.updateView();
  };

  public render = (parent: JQuery<HTMLElement>): void => {
    if (parent && this.view) {
      parent.append(this.view);
    }
  };

  public remove = () => {
    if (this.view) {
      this.view.remove();
    }
  };

  public getAddition = (): tAddition => {
    return this.addition;
  };

  public setAddition = (addition: tAddition): void => {
    this.addition = addition;
  };
}
