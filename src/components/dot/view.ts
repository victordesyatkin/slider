import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import { calcOffset } from "../../helpers/utils";
import classnames from "classnames";
import { orderBy } from "lodash";

export default class DotView implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private parent?: JQuery<HTMLElement>;
  private isRendered: boolean = false;

  constructor(addition: Addition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props && !isUndefined(get(this.addition, ["value"]))) {
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
    const value = get(this.addition, ["value"]);
    let values = get(this.props, ["values"]);
    let active = false;
    if (!isUndefined(values) && !isUndefined(value)) {
      if (values.length === 1) {
        active = value < values[0];
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

  public setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.render();
  };

  public render = (parent?: JQuery<HTMLElement>): void => {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered && this.parent && this.view) {
      this.parent.append(this.view);
      this.isRendered = true;
    }
  };

  public remove = () => {
    if (this.view) {
      this.view.remove();
      this.view = undefined;
      this.isRendered = false;
    }
  };

  public getAddition = (): Addition => {
    return this.addition;
  };

  public setAddition = (addition: Addition): void => {
    this.addition = addition;
  };
}
