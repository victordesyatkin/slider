import $ from "jquery";
import get from "lodash/get";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import { objectToString, calcOffset } from "../../helpers/utils";
import classnames from "classnames";

export default class MarkView implements ISubView {
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: tAddition;

  constructor(addition: tAddition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      this.view = $("<div/>", this.prepareAttr());
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
    const className = get(this.props, ["mark", "className"], "");
    return classnames(`${prefixCls}__mark`, className);
  };

  private prepareStyle = (): string | undefined => {
    if (this.props) {
      const value = get(this.addition, ["value"], 0);
      const style = get(this.props, ["mark", "style"], {});
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
    }
    return;
  };

  private prepareContent = (): void => {
    if (this.view) {
      const { value } = this.addition;
      if (value) {
        const render = get(this.props, ["mark", "render"]);
        let content = `${value}`;
        if (render) {
          content = render(value);
        }
        if (content) {
          this.view.empty().append(content);
        }
      }
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
    this.prepareContent();
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