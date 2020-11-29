import uniq from "lodash/uniq";
import DotsModel from "./model";
import DotsView from "./view";
import DotPresenter from "../dot/presenter";
import { IDotPresenter } from "../dot/interface";
import { IDotsModel, IDotsProps, IDotsView, IDotsPresenter } from "./interface";
import { calcOffset } from "../utils";

export default class DotsPresenter implements IDotsPresenter {
  private model: IDotsModel;
  private view: IDotsView;
  private values: number[] | undefined;

  constructor(props: IDotsProps) {
    this.values = this.calcValues(props);
    this.model = new DotsModel(this.preparePropsForDotsModel(props));
    this.view = new DotsView(this.model);
  }

  private preparePropsForDotsModel(props: IDotsProps) {
    return {
      ...props,
      className: `${props.prefixCls}__dots`,
      values: this.calcValues(props),
      dotPresenters: this.factoryDots(props),
    };
  }

  private calcValues(props: IDotsProps): number[] | undefined {
    const { min, max, step, marks } = props;
    let values = new Array();
    if (marks !== undefined) {
      const _dots = marks.dots;
      if (_dots && Array.isArray(marks.values)) {
        values = [...marks.values];
      }
    }
    if (step !== undefined) {
      for (let i = min; i <= max; i += step) {
        values.push(i);
      }
    }
    return uniq(values);
  }

  private factoryDots(props: IDotsProps): IDotPresenter[] | undefined {
    const { min, max, dots } = props;
    //TODO common check?
    if (!dots || !this.values) {
      return undefined;
    }
    const dotPresenters = new Array();
    for (let v of this.values) {
      const offset = calcOffset(v, min, max);
      dotPresenters.push(
        new DotPresenter({
          ...props,
          offset,
        })
      );
    }

    return dotPresenters;
  }

  public getDotsValues() {
    return this.model.getProps().values;
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
