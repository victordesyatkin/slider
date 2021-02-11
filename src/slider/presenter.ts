import merge from "lodash/merge";

import { DefaultProps } from "../types";
import { IModel, IView, IPresenter } from "./interface";

export default class Presenter implements IPresenter {
  private model: IModel;
  private view: IView;

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;
    this.view.setProps(this.model.getProps());
    this.initHandlesView();
    this.initHandlesModel();
  }

  private initHandlesView = (): void => {
    this.view.subscribe("setPropsModel", this.setPropsModel);
    this.view.subscribe("handleViewMouseDown", this.handleViewMouseDown);
    this.view.subscribe("handleWindowMouseUp", this.handleWindowMouseUp);
  };

  private initHandlesModel = (): void => {
    this.model.subscribe("setPropsView", this.setPropsView);
  };

  private handleViewMouseDown = (values?: number[]) => {
    this.model.publish("handleViewMouseDown", values);
  };

  private handleWindowMouseUp = (values?: number[]) => {
    this.model.publish("handleWindowMouseUp", values);
  };

  private setPropsModel = (values: number[]): void => {
    this.model.setProps(merge({}, this.model.getProps(), { values }));
  };

  private setPropsView = (props: DefaultProps): void => {
    this.view.setProps(props);
  };
}
