import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import classnames from "classnames";
import PubSub from "../../helpers/pubsub";

export default class TooltipView implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private isRendered: boolean = false;
  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
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
    const className = get(this.props, ["tooltip", "className"], "");
    const always = get(this.props, ["tooltip", "always"]);

    return classnames(`${prefixCls}__tooltip`, className, {
      [`${prefixCls}__tooltip_always`]: always,
    });
  };

  prepareStyle = (): string | undefined => {
    if (this.props) {
      const style = get(this.props, ["tooltip", "style"], {});
      const positionStyle = {};
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
        const render = get(this.props, ["tooltip", "render"]);
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

  updateView(): void {
    if (this.view) {
      if (get(this.props, ["tooltip", "on"])) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.prepareContent();
    this.render();
  };

  onHandlers = (): void => {};

  onClick = (): void => {};

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
