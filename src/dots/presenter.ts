import DotsModel from "./model";
import DotsView from "./view";
import DotPresenter from "../dot/presenter";
import {
  IDotModel,
  IDotProps,
  IDotView,
  IDotPresenter,
} from "../dot/interface";
import { IDotsModel, IDotsProps, IDotsView, IDotsPresenter } from "./interface";
import { calcOffset } from "../utils";

export default class DotsPresenter implements IDotsPresenter {
  private model: IDotsModel;
  private view: IDotsView;

  constructor(props: IDotsProps) {
    this.model = new DotsModel(this.preparePropsForDotsModel(props));
    this.view = new DotsView(this.model);
  }

  private preparePropsForDotsModel(props: IDotsProps) {
    return {
      ...props,
      className: `${props.prefixCls}__dots`,
      dotPresenters: this.factoryDots(props),
    };
  }

  private factoryDots(props: IDotsProps): IDotPresenter[] | undefined {
    const { min, max, step, dots } = props;
    const dotPresenters = new Array();
    if (!dots) {
      return undefined;
    }
    const count = Math.floor((max - min) / step) + 1;
    for (let i = 0; i < count; i += 1) {
      const value = i * step;
      const offset = calcOffset(value, min, max);
      dotPresenters.push(
        new DotPresenter({
          ...props,
          offset,
        })
      );
    }
    return dotPresenters;
  }

  getModel(): IDotsModel {
    return this.model;
  }

  setModel(model: IDotsModel): void {
    this.model = model;
  }

  updateModel(props: IDotsProps): void {
    const _props = this.preparePropsForDotsModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): IDotsView {
    return this.view;
  }

  public setView(view: IDotsView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  html(): string {
    return this.view.html();
  }
}
