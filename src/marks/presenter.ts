import classnames from "classnames";
import MarkModel from "./model";
import MarkView from "./view";
import { IMarkPresenter } from "../mark/interface";
import MarkPresenter from "../mark/presenter";
import {
  IMarksModel,
  IMarksProps,
  IMarksView,
  IMarksPropsModel,
} from "./interface";
import { calcOffset } from "../utils";

export default class MarksPresenter {
  private model: IMarksModel;
  private view: IMarksView;

  constructor(props: IMarksProps) {
    const _props = this.preparePropsForModel(props);
    this.model = new MarkModel(_props);
    this.view = new MarkView(this.model);
  }

  private preparePropsForModel(props: IMarksProps): IMarksPropsModel {
    return {
      ...props,
      className: classnames(props.className, `${props.prefixCls}__marks`),
      items: this.factoryItems(props),
      style: this.prepareStyle(props),
    };
  }

  private factoryItems = (props: IMarksProps): IMarkPresenter[] | undefined => {
    const { max, min, step, prefixCls, style, render, onClick } = props;
    const count = Math.floor((max - min) / step) + 1;
    const items = new Array();
    for (let i = 0; i < count; i += 1) {
      const value = i * step;
      const offset = calcOffset(value, min, max);
      items.push(
        new MarkPresenter({
          className: `${prefixCls}__mark`,
          label: `${value}`,
          offset,
          style,
          render,
          onClick,
        })
      );
    }
    return items;
  };

  private prepareStyle(props: any): { [key: string]: string } | undefined {
    const { vertical } = props;
    return;
  }

  getModel(): IMarksModel {
    return this.model;
  }

  setModel(model: IMarksModel): void {
    this.model = model;
  }

  updateModel(props: IMarksProps): void {
    const _props = this.preparePropsForModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): IMarksView {
    return this.view;
  }

  public setView(view: IMarksView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  html(): string {
    return this.view.html();
  }
}
