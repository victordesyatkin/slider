import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import { calcOffset } from "../../helpers/utils";
import classnames from "classnames";
import { orderBy } from "lodash";

export default class DotView implements ISubView {
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: tAddition;

  constructor(addition: tAddition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      this.view = $("<div/>", this.prepareAttr());
      this.onHandlers();
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
    const className = get(this.props, ["dot", "className"], "");
    const reverse = get(this.props, ["reverse"]);
    const value = get(this.addition, ["value"], 0);
    let values = get(this.props, ["values"]);
    let active = false;
    if (!isUndefined(values) && !isUndefined(value)) {
      if (values.length === 1) {
        active = reverse
          ? value > values[0]
            ? true
            : false
          : value < values[0]
          ? true
          : false;
      } else if (values.length > 1) {
        values = orderBy(values);
        if (value >= values[0] && value <= values[values.length - 1]) {
          active = true;
        }
      }
    }
    return classnames(`${prefixCls}__dot`, className, {
      [`${prefixCls}__dot_active`]: active,
    });
  };

  private prepareStyle = (): string | undefined => {
    if (this.props) {
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
    }
    return;
  };

  private updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  private onClick = (e: any) => {
    if (this.view && this.props) {
      const { value, handlers, index = 0 } = this.addition;
      const click = get(handlers, ["click"]);
      if (!isUndefined(value) && click) {
        click(index, e, value);
      }
    }
  };

  private onHandlers = () => {
    if (this.view) {
      this.view.on("click", this.onClick);
    }
  };

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
