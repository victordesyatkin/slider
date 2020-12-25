import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import orderBy from "lodash/orderBy";

import PubSub from "../../helpers/pubsub";
import { objectToString, calcOffset } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";

export default class DotView extends PubSub implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private parent?: JQuery<HTMLElement>;
  private isRendered: boolean = false;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  createView(): void {
    if (this.props && !isUndefined(get(this.addition, ["value"]))) {
      this.view = $("<div/>", this.prepareAttr());
      this.onHandlers();
    }
  }

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

  remove = (): void => {
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
    const className = get(this.props, ["dot", "className"], "");
    const value = get(this.addition, ["value"]);
    let values = get(this.props, ["values"]);
    let active = false;
    if (!isUndefined(values) && !isUndefined(value)) {
      if (values.length === 1) {
        active = value >= values[0];
      } else if (values.length > 1) {
        values = orderBy(values);
        if (value >= values[0] && value <= values[values.length - 1]) {
          active = true;
        }
      }
      return classnames(`${prefixCls}__dot`, className, {
        [`${prefixCls}__dot_active`]: active,
      });
    }
    return "";
  };

  prepareStyle = (): string | undefined => {
    if (!this.props) {
      return;
    }
    const value = get(this.addition, ["value"], 0);
    const style = get(this.props, ["dot", "style"], {});
    const { vertical, min, max, reverse } = this.props;
    const offset = calcOffset(value, min, max);
    const positionStyle = vertical
      ? {
          [reverse ? "top" : "bottom"]: `${offset}%`,
          [reverse ? "bottom" : "top"]: "auto",
          transform: reverse ? "none" : `translateY(+50%)`,
        }
      : {
          [reverse ? "right" : "left"]: `${offset}%`,
          [reverse ? "left" : "right"]: "auto",
          transform: `translateX(${reverse ? "+" : "-"}50%)`,
        };
    return objectToString({
      ...style,
      ...positionStyle,
    });
  };

  updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  onClick = (e: any): void => {
    if (this.view && this.props) {
      const { value, handlers, index = 0 } = this.addition;
      const click = get(handlers, ["click"]);
      if (!isUndefined(value) && click) {
        click(index, e, value);
      }
    }
  };

  onHandlers = (): void => {
    if (this.view) {
      this.view.on("click", this.onClick);
    }
  };
}
