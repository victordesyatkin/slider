import $ from "jquery";
import { objectToString } from "../utils";
import { IHandleModel, IHandleProps, IHandleView } from "./interface";
export default class HandleView implements IHandleView {
  private model: IHandleModel;
  private view: JQuery<HTMLElement>;

  constructor(model: IHandleModel) {
    this.model = model;
    this.view = this.createView();
  }

  public getModel(): IHandleModel {
    return this.model;
  }

  public createView() {
    const { className, elStyle } = this.model.getProps();
    return $("<div/>", {
      class: className,
      style: objectToString(elStyle),
    });
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public onViewHandler(): void {
    const {
      handleBlur,
      handleKeyDown,
      handleMouseDown,
    } = this.model.getProps();
    this.view.on({
      blur: handleBlur,
      keyDown: handleKeyDown,
      mouseDown: handleMouseDown,
    });
  }

  public offViewHandler(): void {
    const props = this.model.getProps();
    const { handleBlur, handleKeyDown, handleMouseDown } = props;
    this.view.off({
      blur: handleBlur,
      keyDown: handleKeyDown,
      mouseDown: handleMouseDown,
    });
  }

  public updateModel(model: IHandleModel): void {
    this.offViewHandler();
    this.model = model;
    this.updateView();
  }

  private updateView(): void {
    const { className, elStyle } = this.model.getProps();
    this.view.attr({
      class: className,
      style: objectToString(elStyle),
    });
    this.onViewHandler();
  }

  public html() {
    return $("<div/>").append(this.view).html();
  }
}
