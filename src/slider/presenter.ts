import { tDefaultProps } from "../types";

export default class Presenter {
  private model: any;
  private view: any;

  constructor(model: any, view: any) {
    this.model = model;
    this.view = view;
    this.view.setProps(this.model.getProps());
  }

  public render(parent: JQuery<HTMLElement>): void {
    this.view.render(parent);
  }
}
