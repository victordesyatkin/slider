import $ from "jquery";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import { objectToString } from "../../helpers/utils";
import { ISubView } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import classnames from "classnames";

export default class TooltipView implements ISubView {
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
    const className = get(this.props, ["tooltip", "className"], "");
    const allways = get(this.props, ["tooltip", "allways"]);

    return classnames(`${prefixCls}__tooltip`, className, {
      [`${prefixCls}__tooltip_allways`]: allways,
    });
  };

  private prepareStyle = (): string | undefined => {
    if (this.props) {
      const style = get(this.props, ["tooltip", "style"], {});
      const { vertical, min, max, reverse } = this.props;
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
