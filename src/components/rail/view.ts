import $ from "jquery";
import get from "lodash/get";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import classnames from "classnames";
import PubSub from "../../helpers/pubsub";

export default class RailView extends PubSub implements ISubView {
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
    if (this.props) {
      const on = get(this.props, ["rail", "on"]);
      if (on) {
        this.view = $("<div/>", this.prepareAttr());
      }
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
    const className = get(this.props, ["rail", "className"], "");
    return classnames(`${prefixCls}__rail`, className);
  };

  prepareStyle = (): string | undefined => {
    const style = get(this.props, ["rail", "style"], {});
    return objectToString({
      ...style,
    });
  };

  updateView(): void {
    if (this.view) {
      if (get(this.props, ["rail", "on"])) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  onClick = (e: any) => {
    if (this.view && this.props) {
      const { handlers, index = 0 } = this.addition;
      const click = get(handlers, ["click"]);
      if (click) {
        click(index, e);
      }
    }
  };

  onHandlers = () => {
    if (this.view) {
      this.view.off("click", this.onClick);
      this.view.on("click", this.onClick);
    }
  };

  setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.onHandlers();
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
