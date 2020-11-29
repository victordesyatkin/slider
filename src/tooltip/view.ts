import $ from "jquery";
import { ITooltipModel, ITooltipView } from "./interface";
export default class TooltipView implements ITooltipView {
  private model: ITooltipModel;
  private view: JQuery<HTMLElement>;

  constructor(model: ITooltipModel) {
    this.model = model;
    this.view = this.createView();
  }

  private createView() {
    return this.prepareView($("<div/>", this.prepareAttr()));
  }

  private prepareView(view: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const { label } = this.model.getProps();
    return view.append($(`<span>${label}</span>`));
  }

  private prepareAttr = (): {
    class: string;
    style?: string;
  } => {
    const { className, style = "", label = "" } = this.model.getProps();
    const attr: { class: string; style?: string } = {
      class: className,
    };
    if (style) {
      attr.style = style;
    }
    return attr;
  };

  private updateView(): void {
    this.prepareView(this.view.attr(this.prepareAttr()));
  }

  public updateModel(model: ITooltipModel): void {
    this.model = model;
    this.updateView();
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public getModel(): ITooltipModel {
    return this.model;
  }

  public html() {
    return $("<div/>").append(this.view).html();
  }
}
