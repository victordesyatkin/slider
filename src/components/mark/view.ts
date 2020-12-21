import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import { objectToString, calcOffset } from "../../helpers/utils";
import classnames from "classnames";
import PubSub from "../../helpers/pubsub";

export default class MarkView extends PubSub implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private isRendered: boolean = false;
  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  createView(): void {
    if (this.props && !isUndefined(get(this.addition, ["value"]))) {
      this.view = $("<div/>", this.prepareAttr());
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
    const className = get(this.props, ["mark", "className"], "");
    return classnames(`${prefixCls}__mark`, className);
  };

  prepareStyle = (): string | undefined => {
    if (this.props) {
      const value = get(this.addition, ["value"], 0);
      const style = get(this.props, ["mark", "style"], {});
      const { vertical, min, max, reverse } = this.props;
      const offset = calcOffset(value, min, max);
      const positionStyle = vertical
        ? {
            [reverse ? "top" : "bottom"]: `${offset}%`,
            [reverse ? "bottom" : "top"]: "auto",
            transform: reverse ? "translateY(-25%)" : `translateY(+50%)`,
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

  prepareContent = (): void => {
    if (this.view) {
      const { value } = this.addition;
      if (!isUndefined(value)) {
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

  onClick = (e: any) => {
    if (this.view && this.props) {
      const { value, handlers, index = 0 } = this.addition;
      const click = get(handlers, ["click"]);
      if (!isUndefined(value) && click) {
        click(index, e, value);
      }
    }
  };

  onHandlers = () => {
    if (this.view) {
      this.view.off("click", this.onClick);
      this.view.on("click", this.onClick);
    }
  };

  updateView = (): void => {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  };

  setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.onHandlers();
    this.prepareContent();
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
