import { fromPairs } from "lodash";
import merge from "lodash/merge";
import { tDefaultProps } from "../types";
import { IModel, IView, IPresenter } from "./interface";

export default class Presenter implements IPresenter {
  private model: any;
  private view: any;

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;
    this.view.setProps(this.model.getProps());
    this.onHandleView();
    this.onHandleModel();
  }

  private onHandleView = (): void => {
    this.view.subscribe("setPropsModel", this.setPropsModel);
  };

  private setPropsModel = (values: number[]): void => {
    this.model.setProps(merge(this.model.getProps(), { values }));
  };

  private onHandleModel = (): void => {
    this.model.subscribe("setPropsView", this.setPropsView);
  };

  private setPropsView = (props: tDefaultProps): void => {
    this.view.setProps(props);
  };

  public render(parent: JQuery<HTMLElement>): void {
    this.view.render(parent);
  }
}
