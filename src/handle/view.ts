import $ from "jquery";
import classnames from "classnames";
import { objectToString } from "../utils";
import { IHandleModel, IHandleProps, IHandleView } from "./interface";
export default class HandleView implements IHandleView {
  private model: IHandleModel;
  private view: JQuery<HTMLElement>;

  constructor(model: IHandleModel) {
    this.model = model;
    this.view = this.createView();
    this.onViewHandler();
  }

  private createView() {
    return $("<div/>", this.prepareAttr());
  }

  private prepareAttr = (): {
    class: string;
    style: string;
    tabindex?: number;
  } => {
    const { className, elStyle, focused } = this.model.getProps();
    let { tabIndex, focus } = this.model.getProps();
    if (tabIndex === undefined) {
      tabIndex = 0;
    }
    if (!focus && this.view) {
      focus = this.view.is(":focus");
    }
    const attr: { class: string; style: string; tabindex?: number } = {
      class: classnames(
        className,
        {
          [`${className}_focus`]:
            focus || (this.view && this.view.is(":focus")),
        },
        { [`${className}_focused`]: focused }
      ),
      style: objectToString(elStyle),
    };
    if (!(tabIndex < 0)) {
      attr.tabindex = tabIndex;
    }
    return attr;
  };

  private onViewHandler(): void {
    const props = this.model.getProps();
    const {
      handleBlur,
      handleFocus,
      handleKeyUp,
      handleKeyDown,
      handleMouseUp,
      handleMouseDown,
    } = props;
    this.view.on({
      focus: handleFocus,
      blur: handleBlur,
      keyup: handleKeyUp,
      keydown: handleKeyDown,
      mouseup: handleMouseUp,
      mousedown: handleMouseDown,
    });
  }

  private offViewHandler(): void {
    const props = this.model.getProps();
    const {
      handleBlur,
      handleFocus,
      handleKeyUp,
      handleKeyDown,
      handleMouseUp,
      handleMouseDown,
    } = props;
    this.view.off({
      focus: handleFocus,
      blur: handleBlur,
      keyup: handleKeyUp,
      keydown: handleKeyDown,
      mouseup: handleMouseUp,
      mousedown: handleMouseDown,
    });
  }

  private updateView(): void {
    this.view.attr(this.prepareAttr());
    //this.onViewHandler();
  }

  public updateModel(model: IHandleModel): void {
    //this.offViewHandler();
    this.model = model;
    this.updateView();
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  public getModel(): IHandleModel {
    return this.model;
  }

  public html() {
    return $("<div/>").append(this.view).html();
  }
}
