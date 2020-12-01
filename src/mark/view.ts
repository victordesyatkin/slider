import $ from "jquery";
import { objectToString } from "../utils";
import { IMarkModel, IMarkView } from "./interface";
export default class MarkView implements IMarkView {
  private model: IMarkModel;
  private view: JQuery<HTMLElement>;

  constructor(model: IMarkModel) {
    this.model = model;
    this.view = this.createView();
  }

  private createView() {
    return this.prepareView($("<div/>", this.prepareAttr()));
  }

  private prepareView(view: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const { onClickPresenter } = this.model.getProps();
    return view.on({
      click: onClickPresenter,
    });
  }

  private prepareAttr = (): {
    class: string;
    style: string;
  } => {
    const { className, style = {}, label } = this.model.getProps();
    const attr: { class: string; style: string; text: string } = {
      class: className,
      style: objectToString(style),
      text: label,
    };
    return attr;
  };

  private updateView(): void {
    this.view.attr(this.prepareAttr());
  }

  public updateModel(model: IMarkModel): void {
    this.model = model;
    this.updateView();
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public getModel(): IMarkModel {
    return this.model;
  }

  public html(): string {
    return $("<div/>").append(this.view).html();
  }
}
