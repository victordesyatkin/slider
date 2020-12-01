import $ from "jquery";
import { IDotsModel, IDotsView } from "./interface";
export default class DotsView implements IDotsView {
  private model: IDotsModel;
  private view: JQuery<HTMLElement>;

  constructor(model: IDotsModel) {
    this.model = model;
    this.view = this.createView();
  }

  private createView() {
    const { className, dotPresenters = [] } = this.model.getProps();
    return $("<div/>", {
      class: className,
    }).append(dotPresenters.map((v) => v.get$View()));
  }

  private updateView(): void {
    const { className, dotPresenters = [] } = this.model.getProps();
    this.view
      .attr({
        class: className,
      })
      .empty()
      .append(dotPresenters.map((v) => v.getView().get$View()));
  }

  public updateModel(model: IDotsModel): void {
    this.model = model;
    this.updateView();
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public getModel(): IDotsModel {
    return this.model;
  }

  public html(): string {
    return $("<div/>").append(this.view).html();
  }
}
