import DotModel from "./model";
import DotView from "./view";
import { IDotModel, IDotProps, IDotView, IDotPropsModel } from "./interface";

export default class DotPresenter {
  private model: IDotModel;
  private view: IDotView;

  constructor(props: IDotProps) {
    const _props = this.preparePropsForDotModel(props);
    this.model = new DotModel(_props);
    this.view = new DotView(this.model);
  }

  preparePropsForDotModel(props: IDotProps): IDotPropsModel {
    return {
      className: `${props.prefixCls}__dot`,
      style: this.prepareElstyle(props),
    };
  }

  prepareElstyle(props: IDotProps): { [key: string]: string } {
    const { vertical, dotStyle, offset, reverse } = props;
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
    const elstyle = {
      ...dotStyle,
      ...positionStyle,
    };
    return elstyle;
  }

  getModel(): IDotModel {
    return this.model;
  }

  setModel(model: IDotModel): void {
    this.model = model;
  }

  updateModel(props: IDotProps): void {
    const _props = this.preparePropsForDotModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): IDotView {
    return this.view;
  }

  public setView(view: IDotView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  html(): string {
    return this.view.html();
  }
}
