import $ from "jquery";
import { objectToString } from "../utils";
import { IDotModel, IDotView } from "./interface";
export default class DotView implements IDotView {
  private model: IDotModel;
  private view: JQuery<HTMLElement>;

  constructor(model: IDotModel) {
    this.model = model;
    this.view = this.createView();
  }

  private createView() {
    return $("<div/>", this.prepareAttr());
  }

  private prepareAttr = (): {
    class: string;
    style: string;
  } => {
    const { className, style } = this.model.getProps();
    const attr: { class: string; style: string } = {
      class: className,
      style: objectToString(style),
    };
    return attr;
  };

  private updateView(): void {
    this.view.attr(this.prepareAttr());
  }

  public updateModel(model: IDotModel): void {
    this.model = model;
    this.updateView();
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public getModel(): IDotModel {
    return this.model;
  }

  public html(): string {
    return $("<div/>").append(this.view).html();
  }
}
