import $ from "jquery";
import { objectToString } from "../utils";
import { IMarksModel, IMarksView } from "./interface";
export default class MarkView implements IMarksView {
  private model: IMarksModel;
  private view: JQuery<HTMLElement>;

  constructor(model: IMarksModel) {
    this.model = model;
    this.view = this.createView();
  }

  private createView() {
    const { items = [] } = this.model.getProps();
    return $("<div/>", this.prepareAttr()).append(
      items.map((v) => v.getView().get$View())
    );
  }

  private prepareAttr = (): {
    class: string;
    style: string;
  } => {
    const { className = "", style = {} } = this.model.getProps();
    const attr: { class: string; style: string } = {
      class: className,
      style: objectToString(style),
    };
    return attr;
  };

  private updateView(): void {
    const { items = [] } = this.model.getProps();
    this.view
      .attr(this.prepareAttr())
      .empty()
      .append(items.map((v) => v.getView().get$View()));
  }

  public updateModel(model: IMarksModel): void {
    this.model = model;
    this.updateView();
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public getModel(): IMarksModel {
    return this.model;
  }

  public html() {
    return $("<div/>").append(this.view).html();
  }
}
