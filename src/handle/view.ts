import $ from "jquery";
import { objectToString } from "../utils";
import { IHandleModel, IHandleProps } from "./interface";
export default class HandleView {
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

  render() {
    return $("<div/>").append(this.view).html();
  }
}
