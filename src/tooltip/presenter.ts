import classnames from "classnames";
import { objectToString } from "../utils";
import TooltipModel from "./model";
import TooltipView from "./view";
import {
  ITooltipModel,
  ITooltipProps,
  ITooltipView,
  ITooltipPropsModel,
} from "./interface";

export default class TooltipPresenter {
  private model: ITooltipModel;
  private view: ITooltipView;

  constructor(props: ITooltipProps) {
    const _props = this.preparePropsForModel(props);
    this.model = new TooltipModel(_props);
    this.view = new TooltipView(this.model);
  }

  preparePropsForModel(props: ITooltipProps): ITooltipPropsModel {
    const { render, value, precision = 0, show } = props;
    const _props: ITooltipPropsModel = {
      className: classnames(`${props.prefixCls}__tooltip`, props.classNames, {
        [`${props.prefixCls}__tooltip_active`]: props.active,
      }),
      style: props.style ? objectToString(props.style) : "",
      label: render
        ? render(parseFloat(value.toFixed(precision)))
        : value.toFixed(precision),
      show,
    };
    return _props;
  }

  getModel(): ITooltipModel {
    return this.model;
  }

  setModel(model: ITooltipModel): void {
    this.model = model;
  }

  updateModel(props: ITooltipProps): void {
    const _props = this.preparePropsForModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): ITooltipView {
    return this.view;
  }

  public setView(view: ITooltipView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> | string {
    return this.model.getProps().show ? this.view.get$View() : "";
  }

  html(): string {
    return this.view.html();
  }
}
