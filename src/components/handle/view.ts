import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import PubSub from "../../helpers/pubsub";
import { calcOffset, objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import TooltipView from "../tooltip/view";

export default class HandleView extends PubSub implements ISubView {
  private addition: Addition;
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private isRendered: boolean = false;
  private parent?: JQuery<HTMLElement>;
  private tooltip?: TooltipView;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  getAddition(): Addition {
    return this.addition;
  }

  setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.appendTooltip();
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

  setAddition = (addition: Addition): void => {
    this.addition = addition;
  };

  createView(): void {
    if (this.props) {
      this.view = $("<div/>", this.prepareAttr());
      this.onHandlers();
    }
  }

  onMouseDown = (e: any): void => {
    const mousedown = get(this.addition, ["handlers", "mousedown"]);
    const index = get(this.addition, ["index"]);
    if (!isUndefined(index) && mousedown) {
      mousedown(index, e);
    }
  };

  prepareAttr = () => {
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
  };

  prepareClassName = (): string => {
    const prefixCls = get(this.props, ["prefixCls"], "");
    const index = get(this.addition, ["index"]);
    const className = get(this.props, ["handle", "classNames", index], "");
    const active = get(this.addition, ["active"]);
    return classnames(`${prefixCls}__handle`, className, {
      [`${prefixCls}__handle_active`]: active,
    });
  };

  prepareStyle = (): string | undefined => {
    if (this.props) {
      const index = get(this.addition, ["index"]);
      const style = get(this.props, ["handle", "styles", index], {});
      const { values, min, max, vertical, reverse } = this.props;
      const value = values[index];
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
        "z-index": index + 10,
      });
    }
  };

  appendTooltip = (): void => {
    const on = get(this.props, ["tooltip", "on"]);
    if (on && this.view && this.props) {
      const index = get(this.addition, ["index"]);
      const value = get(this.props, ["values", index]);
      if (!isUndefined(value)) {
        if (this.tooltip) {
          this.tooltip.setAddition({ value, index });
          this.tooltip.setProps(this.props);
        } else {
          this.tooltip = new TooltipView({ value, index });
          this.tooltip.setProps(this.props);
          this.tooltip.render(this.view);
        }
      }
    } else if (this.tooltip && this.view) {
      this.tooltip.remove();
      this.tooltip = undefined;
      this.view.empty();
    }
  };

  updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  onHandlers = (): void => {
    if (this.view) {
      this.view.on({
        mousedown: this.onMouseDown,
      });
    }
  };

  onClick = (): void => {};
}
