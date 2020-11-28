import HandleModel from "./model";
import HandleView from "./view";
import {
  IHandleModel,
  IHandleProps,
  IHandleView,
  IHandlePropsModel,
} from "./interface";
import { noop } from "lodash";

export default class HandlePresenter {
  private model: IHandleModel;
  private view: IHandleView;

  constructor(props: IHandleProps) {
    const _props = this.preparePropsForHandleModel(props);
    this.model = new HandleModel(_props);
    this.view = new HandleView(this.model);
  }

  preparePropsForHandleModel(props: IHandleProps): IHandlePropsModel {
    return {
      ...props,
      elStyle: this.prepareElStyle(props),
      handleFocus: this.handleFocus,
      handleBlur: this.handleBlur,
      handleKeyUp: noop,
      handleKeyDown: noop,
      handleMouseUp: this.handleMouseUp,
      handleMouseDown: this.handleMouseDown,
    };
  }

  handleMouseDown = () => {
    // console.log("handleMouseDown : "); // TODO
    this.view.get$View().get(0).focus();
  };

  handleMouseUp = (): void => {
    if (
      document.activeElement &&
      document.activeElement === this.view.get$View().get(0)
    ) {
      // console.log("handleMouseUp : "); // TODO
      this.updateModel({
        ...this.model.getProps(),
        focus: false,
        focused: true,
      });
    }
  };

  handleFocus = (): void => {
    // console.log("handleFocus : "); // TODO
    this.updateModel({ ...this.model.getProps(), focus: true, focused: false });
  };

  handleBlur = (): void => {
    // console.log("handleBlur : "); // TODO
    this.updateModel({
      ...this.model.getProps(),
      focus: false,
      focused: false,
    });
  };

  prepareElStyle(props: IHandleProps): { [key: string]: string } {
    const { vertical, reverse, offset, style } = props;
    const positionStyle = vertical
      ? {
          [reverse ? "top" : "bottom"]: `${offset}%`,
          [reverse ? "bottom" : "top"]: "auto",
          transform: reverse ? "none" : `translateY(+50%)`,
        }
      : {
          [reverse ? "right" : "left"]: `${offset}%`,
          [reverse ? "left" : "right"]: "auto",
          transform: `translateX(${reverse ? "+" : "-"}50%)`,
        };
    const elStyle = {
      ...style,
      ...positionStyle,
    };
    return elStyle;
  }

  getModel(): IHandleModel {
    return this.model;
  }

  setModel(model: IHandleModel): void {
    this.model = model;
  }

  updateModel(props: IHandleProps): void {
    const _props = this.preparePropsForHandleModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): IHandleView {
    return this.view;
  }

  public setView(view: IHandleView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  html(): string {
    return this.view.html();
  }
}
