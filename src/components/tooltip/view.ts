import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import PubSub from "../../helpers/pubsub";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";

export default class TooltipView extends PubSub implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private isRendered: boolean = false;
  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
    super();
    this.addition = addition;
  }

  public setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.prepareContent();
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

  private createView(): void {
    if (this.props && !isUndefined(get(this.addition, ["value"]))) {
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
    const className = get(this.props, ["tooltip", "className"], "");
    const always = get(this.props, ["tooltip", "always"]);

    return classnames(`${prefixCls}__tooltip`, className, {
      [`${prefixCls}__tooltip_always`]: always,
    });
  };

  private prepareStyle = (): string | undefined => {
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

  private prepareContent = (): void => {
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

  private updateView(): void {
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
}
