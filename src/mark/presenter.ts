import classnames from "classnames";
import MarkModel from "./model";
import MarkView from "./view";
import { IMarkModel, IMarkProps, IMarkView } from "./interface";

export default class MarkPresenter {
  private model: IMarkModel;
  private view: IMarkView;

  constructor(props: IMarkProps) {
    const _props = this.preparePropsForModel(props);
    this.model = new MarkModel(_props);
    this.view = new MarkView(this.model);
  }

  private preparePropsForModel(props: IMarkProps): IMarkProps {
    return {
      ...props,
      className: classnames(props.className, {
        [`${props.className}_focus`]: props.focus,
      }),
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      style: this.prepareStyle(props),
    };
  }

  private onFocus = () => {
    this.updateModel({ ...this.model.getProps(), focus: true });
  };

  private onBlur = () => {
    this.updateModel({ ...this.model.getProps(), focus: false });
  };

  private prepareStyle(props: any): { [key: string]: string } {
    // IDotProps
    const { vertical, style, offset, reverse } = props;
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
      ...style,
      ...positionStyle,
    };
    return elstyle;
  }

  getModel(): IMarkModel {
    return this.model;
  }

  setModel(model: IMarkModel): void {
    this.model = model;
  }

  updateModel(props: IMarkProps): void {
    const _props = this.preparePropsForModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): IMarkView {
    return this.view;
  }

  public setView(view: IMarkView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  html(): string {
    return this.view.html();
  }
}
