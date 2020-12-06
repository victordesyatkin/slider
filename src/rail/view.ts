import $ from "jquery";
import get from "lodash/get";
import { calcOffset, objectToString } from "../utils";
import { IModel, IView, IPresenter } from "../slider/interface";
import { tDefaultProps, tAddition } from "../types";
import classnames from "classnames";

export default class RailView implements IView {
  private model: IModel;
  private view: JQuery<HTMLElement>;
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

  private prepareAttr = (
    props: tDefaultProps
  ): {
    class: string | undefined;
    style: string | undefined;
  } => {
    const attr: { class: string | undefined; style: string | undefined } = {
      class: this.prepareClassName(props),
      style: this.prepareStyle(props),
    };
    return attr;
  };

  private prepareClassName = (props: tDefaultProps): string => {
    const { prefixCls, classNames } = props;
    const index = get(this.addition, ["index"], 0);
    return classnames(`${prefixCls}__rail`, get(classNames, [index]));
  };

  private prepareStyle = (props: tDefaultProps): string | undefined => {
    const style = get(props, ["rail", "style"]);
    return objectToString({
      ...style,
    });
  };

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
