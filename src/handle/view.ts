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
    const view = this.prepareView($("<div/>"));
    return view;
  }

  private prepareView = (view: JQuery<HTMLElement>): JQuery<HTMLElement> => {
    const { tooltipPresenter } = this.model.getProps();
    if (tooltipPresenter) {
      view.append(tooltipPresenter.get$View());
    }
    return view.attr(this.prepareAttr());
  };

  private prepareAttr = (): {
    class: string;
    style: string;
    tabindex?: number;
  } => {
    const { className, elStyle, focused } = this.model.getProps();
    let { tabIndex, focus } = this.model.getProps();
    if (tabIndex === undefined) {
      tabIndex = -1;
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
      tabindex: tabIndex,
    };
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

  // private offViewHandler(): void {
  //   const props = this.model.getProps();
  //   const {
  //     handleBlur,
  //     handleFocus,
  //     handleKeyUp,
  //     handleKeyDown,
  //     handleMouseUp,
  //     handleMouseDown,
  //   } = props;
  //   this.view.off({
  //     focus: handleFocus,
  //     blur: handleBlur,
  //     keyup: handleKeyUp,
  //     keydown: handleKeyDown,
  //     mouseup: handleMouseUp,
  //     mousedown: handleMouseDown,
  //   });
  // }

  private updateView(): void {
    this.prepareView(this.view.empty());
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

  public destroy(): void {
    this.view.remove();
  }

  public html() {
    return $("<div/>").append(this.view).html();
  }
}
