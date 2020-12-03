import $ from "jquery";
import { IModel } from "./interface";

export default class View {
  private model: IModel;
  private view: JQuery<HTMLElement> | undefined;
  private children: JQuery<HTMLElement>[] | undefined;

  constructor(model: IModel) {
    this.model = model;
  }

  private createView(): JQuery<HTMLElement> {
    const view = $("<div/>", this.prepare());
    return view;
  }

  private updateView = (): JQuery<HTMLElement> => {
    if (!this.view) {
      this.view = this.createView();
    }
    return this.view.attr(this.prepare()).empty().append();
  };

  private prepare = (): { class: string } => {
    return {
      class: this.model.className,
    };
  };

  public setChildred(children: JQuery<HTMLElement>[]): void {
    this.children = children;
    this.updateView();
  }

  public setModel(model: IModel): void {
    this.model = model;
    this.updateView();
  }

  public render(el: JQuery<HTMLElement>): void {
    if (!this.view) {
      this.view = this.createView();
    }
    el.append(this.view);
  }
}
