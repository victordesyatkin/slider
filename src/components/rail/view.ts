import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import classnames from "classnames";

export default class RailView implements ISubView {
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: tAddition;

  constructor(addition: tAddition) {
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
    const index = get(this.addition, ["index"]);
    const className = get(this.props, ["rail", "classNames", index], "");
    return classnames(`${prefixCls}__rail`, className);
  };

  private prepareStyle = (): string | undefined => {
    const index = get(this.addition, ["index"]);
    const style = get(this.props, ["rail", "styles", index], {});
    return objectToString({
      ...style,
    });
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
