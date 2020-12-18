import $ from "jquery";
import get from "lodash/get";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import { calcOffset } from "../../helpers/utils";
import classnames from "classnames";
import { isUndefined } from "lodash";

export default class TrackView implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private isRendered: boolean = false;
  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
    this.addition = addition;
  }

  createView(): void {
    if (this.props && !isUndefined(get(this.addition, ["index"]))) {
      const on = get(this.props, ["track", "on"]);
      if (on) {
        this.view = $("<div/>", this.prepareAttr());
      }
    }
  }

  prepareAttr = (): {
    class: string | undefined;
    style: string | undefined;
  } => {
    const attr: { class: string | undefined; style: string | undefined } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
    return attr;
  };

  prepareClassName = (): string => {
    const prefixCls = get(this.props, ["prefixCls"], "");
    const index = get(this.addition, ["index"]);
    const className = get(this.props, ["track", "classNames", index], "");
    return classnames(
      `${prefixCls}__track`,
      { [`${prefixCls}__track-${index}`]: true },
      className
    );
  };

  prepareStyle = (): string | undefined => {
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
      const positionStyle = vertical
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
        ...positionStyle,
        ...style,
      });
    }
  };

  updateView(): void {
    if (this.view) {
      if (get(this.props, ["track", "on"])) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  onHandlers = (): void => {};

  onClick = (): void => {};

  setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.render();
  };

  render = (parent?: JQuery<HTMLElement>): void => {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered && this.parent && this.view) {
      this.parent.append(this.view);
      this.isRendered = true;
    }
  };

  remove = () => {
    if (this.view) {
      this.view.remove();
      this.view = undefined;
      this.isRendered = false;
    }
  };

  getAddition = (): Addition => {
    return this.addition;
  };

  setAddition = (addition: Addition): void => {
    this.addition = addition;
  };
}
