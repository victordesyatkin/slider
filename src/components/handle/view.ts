import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { calcOffset, objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import classnames from "classnames";

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
    console.log("onMouseDown : ");
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
    const { prefixCls, handle } = this.props || {};
    const index = get(this.addition, ["index"], 0);
    return classnames(
      `${prefixCls}__handle`,
      get(handle, ["classNames", index])
    );
  };

  private prepareStyle = (): string | undefined => {
    if (this.props) {
      const index = get(this.addition, ["index"], 0);
      const style = get(this.props, ["handle", "styles", index]);
      const { values, min, max, vertical, reverse } = this.props || {};
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

  private updateView() {
    if (this.view) {
      this.view.attr(this.prepareAttr());
      console.log(this.view);
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
}
