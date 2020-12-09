import $ from "jquery";
import get from "lodash/get";
import classnames from "classnames";
import isUndefined from "lodash/isUndefined";
import { calcOffset, objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import TooltipView from "../tooltip/view";

export default class HandleView implements ISubView {
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: tAddition;

  constructor(addition: tAddition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      this.view = $("<div/>", this.prepareAttr());
      this.view.on({
        mousedown: this.onMouseDown,
      });
    }
  }

  private onMouseDown = (e: JQuery.ClickEvent): void => {
    const mousedown = get(this.addition, ["handlers", "mousedown"]);
    const index = get(this.addition, ["index"]);
    if (!isUndefined(index) && mousedown) {
      mousedown(index, e);
    }
  };

  private prepareAttr = () => {
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

  private prepareClassName = (): string => {
    const prefixCls = get(this.props, ["prefixCls"], "");
    const index = get(this.addition, ["index"]);
    const className = get(this.props, ["handle", "className"], "");
    return classnames(`${prefixCls}__handle`, className);
  };

  private prepareStyle = (): string | undefined => {
    if (this.props) {
      const index = get(this.addition, ["index"]);
      const style = get(this.props, ["handle", "style"], {});
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
      });
    }
  };

  private appendTooltip = () => {
    const on = get(this.props, ["tooltip", "on"]);
    if (on && this.view) {
      const index = get(this.addition, ["index"]);
      const value = get(this.props, ["values", index]);
      if (!isUndefined(value)) {
        const tooltip = new TooltipView({ value, index });
        if (tooltip) {
          this.view.empty();
          tooltip.render(this.view);
        }
      }
    }
  };

  private updateView() {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  public getAddition(): tAddition {
    return this.addition;
  }

  public setProps = (props: tDefaultProps): void => {
    this.props = props;
    this.updateView();
    this.appendTooltip();
  };

  public render = (parent?: JQuery<HTMLElement>): void => {
    if (parent && this.view) {
      parent.append(this.view);
    }
  };

  public remove = () => {
    if (this.view) {
      this.view.remove();
    }
  };

  public setAddition = (addition: tAddition): void => {
    this.addition = addition;
  };
}
