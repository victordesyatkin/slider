import $ from "jquery";
import get from "lodash/get";
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
    const { prefixCls, classNames } = this.props || {};
    return classnames(`${prefixCls}__rail`, classNames);
  };

  private prepareStyle = (): string | undefined => {
    const style = get(this.props, ["rail", "style"]);
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
}
