import { fromPairs } from "lodash";
import merge from "lodash/merge";
import { DefaultProps } from "../types";
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
    this.view.subscribe("onMouseDown", this.onMouseDown);
    this.view.subscribe("onMouseUp", this.onMouseUp);
  };

  private onMouseDown = (values?: number[]) => {
    this.model.publish("onMouseDown", values);
  };

  private onMouseUp = (values?: number[]) => {
    this.model.publish("onMouseUp", values);
  };

  private setPropsModel = (values: number[]): void => {
    this.model.setProps(merge({}, this.model.getProps(), { values }));
  };

  private onHandleModel = (): void => {
    this.model.subscribe("setPropsView", this.setPropsView);
  };

  private setPropsView = (props: DefaultProps): void => {
    this.view.setProps(props);
  };
}
