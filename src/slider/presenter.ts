import bind from "bind-decorator";

import { DefaultPropsView } from "../types";
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

  private initHandlesView(): void {
    this.view.subscribe("handleViewMouseDown", this.handleViewMouseDown);
    this.view.subscribe("handleWindowMouseUp", this.handleWindowMouseUp);
    this.view.subscribe("handleViewClick", this.handleViewClick);
    this.view.subscribe("handleWindowMouseMove", this.handleWindowMouseMove);
  }

  private initHandlesModel(): void {
    this.model.subscribe("setPropsView", this.setPropsView);
  }

  @bind
  private handleWindowMouseMove(options: { event: MouseEvent }): void {
    this.model.publish("handleWindowMouseMove", options);
  }

  @bind
  private handleViewMouseDown(values?: number[]): void {
    this.model.publish("handleViewMouseDown", values);
  }

  @bind
  private handleWindowMouseUp(): void {
    this.model.publish("handleWindowMouseUp");
  }

  @bind
  handleViewClick(options: {
    index: number;
    event: MouseEvent;
    value?: number;
    length: number;
    start: number;
  }) {
    this.model.publish("handleViewClick", options);
  }

  @bind
  private setPropsView(props: DefaultPropsView): void {
    this.view.setProps(props);
  }
}
