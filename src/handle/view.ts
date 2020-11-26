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

  createView() {
    const props = this.model.getProps();
    const {
      className,
      elStyle,
      handleBlur,
      handleKeyDown,
      handleMouseDown,
    } = props;
    return $("<div/>", {
      class: className,
      style: objectToString(elStyle),
    })
      .on("blur", handleBlur)
      .on("keyDown", handleKeyDown)
      .on("mouseDown", handleMouseDown);
  }

  get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  html() {
    return $("<div/>").append(this.view).html();
  }
}
