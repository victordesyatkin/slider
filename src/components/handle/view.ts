import $ from "jquery";
import get from "lodash/get";
import { calcOffset, objectToString } from "../../utils";
import { IModel, ISubView, IPresenter } from "../../slider/interface";
import { tDefaultProps, tAddition } from "../../types";
import classnames from "classnames";

export default class HandleView implements ISubView {
  private model: IModel;
  private view?: JQuery<HTMLElement>;
  private presenter?: IPresenter;
  private addition?: tAddition;

  constructor(model: IModel, presenter: IPresenter, addition: tAddition) {
    this.model = model;
    this.presenter = presenter;
    this.addition = addition;
    this.view = this.createView(this.model.getProps());
  }

  private createView(props: tDefaultProps): JQuery<HTMLElement> {
    return $("<div/>", this.prepareAttr(props));
  }

  private prepareAttr = (props: tDefaultProps) => {
    const attr: {
      class: string | undefined;
      style: string | undefined;
      tabindex: number;
    } = {
      class: this.prepareClassName(props),
      style: this.prepareStyle(props),
      tabindex: -1,
    };
    return attr;
  };

  private prepareClassName = (props: tDefaultProps): string => {
    const { prefixCls, handle } = props;
    const index = get(this.addition, ["index"], 0);
    return classnames(
      `${prefixCls}__handle`,
      get(handle, ["classNames", index])
    );
  };

  private prepareStyle = (props: tDefaultProps): string | undefined => {
    const index = get(this.addition, ["index"], 0);
    const style = get(props, ["handle", "styles", index]);
    const { values, min, max, vertical, reverse } = props;
    const value = values[index];
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
  };

  public getAddition(): tAddition {
    return this.addition;
  }

  public setModel = (model: IModel): void => {
    this.model = model;
  };

  public render = (): JQuery<HTMLElement> => {
    return this.view;
  };

  public remove = () => {
    if (this.view) {
      this.view.remove();
    }
  };
}
