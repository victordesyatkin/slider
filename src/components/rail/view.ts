import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import classnames from "classnames";

export default class RailView implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private isRendered: boolean = false;
  private parent?: JQuery<HTMLElement>;

  constructor(addition: Addition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      const on = get(this.props, ["rail", "on"]);
      if (on) {
        this.view = $("<div/>", this.prepareAttr());
        this.onHandlers();
      }
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
    const className = get(this.props, ["rail", "className"], "");
    return classnames(`${prefixCls}__rail`, className);
  };

  private prepareStyle = (): string | undefined => {
    const style = get(this.props, ["rail", "style"], {});
    return objectToString({
      ...style,
    });
  };

  private updateView(): void {
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

  private onClick = (e: any) => {
    if (this.view && this.props) {
      const { handlers, index = 0 } = this.addition;
      const click = get(handlers, ["click"]);
      if (click) {
        click(index, e);
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
    }
  };

  public getAddition = (): Addition => {
    return this.addition;
  };

  public setAddition = (addition: Addition): void => {
    this.addition = addition;
  };
}
