import $ from "jquery";
import get from "lodash/get";
import classnames from "classnames";
import { IModel, IView, IPresenter, ISubView } from "./interface";
import { tAddition, tDefaultProps } from "../types";
import {
  calcOffset,
  objectToString,
  getMousePosition,
  ensureValueInRange,
} from "../utils";
import RailView from "../rail/view";
import HandleView from "../handle/view";

export default class View implements IView {
  private model: IModel;
  private view: JQuery<HTMLElement>;
  private presenter: IPresenter;
  private tracks: IView[] = [];
  private handles: ISubView[] = [];
  private dots: IView[] = [];
  private marks: IView[] = [];
  private rails: IView[] = [];
  private currentHandleView?: ISubView;

  constructor(model: IModel, presenter: IPresenter) {
    this.model = model;
    this.presenter = presenter;
    const props = this.model.getProps();
    this.view = this.createView(props);
    this.createOrUpdateSubViews(props);
    this.appendSubViews(this.view);
    this.handlersOn();
  }

  private createView(props: tDefaultProps): JQuery<HTMLElement> {
    return $("<div/>", this.prepareAttr(props));
  }

  private updateView = (props: tDefaultProps): void => {
    this.view.attr(this.prepareAttr(props));
  };

  private prepareAttr = (
    props: tDefaultProps
  ): { class: string; style: string } => {
    return {
      class: this.prepareClassName(props),
      style: this.prepareStyle(props),
    };
  };

  private prepareClassName(props: tDefaultProps): string {
    const { prefixCls, mark, disabled, vertical, classNames } = props;
    return classnames(prefixCls, {
      [`${prefixCls}_with-mark`]: get(mark, ["show"]),
      [`${prefixCls}_disabled`]: disabled,
      [`${prefixCls}_vertical`]: vertical,
      classNames,
    });
  }

  private prepareStyle(props: tDefaultProps): string {
    return objectToString({ ...props.style });
  }

  private createOrUpdateSubViews(props: tDefaultProps): void {
    this.createOrUpdateSubView<RailView>(props, this.rails, 1, RailView);
    this.createOrUpdateSubView<HandleView>(
      props,
      this.handles,
      this.getCount(props, this.handles),
      HandleView
    );
    // this.createOrUpdateSubView(
    //   props,
    //   this.tracks,
    //   this.getCount(props, this.handles)
    // );
    // this.createOrUpdateSubView(props, this.dots, 1);
    // this.createOrUpdateSubView(props, this.marks, 1);
  }

  private createOrUpdateSubView<T extends IView>(
    props: tDefaultProps,
    views: IView[],
    count: number,
    c: { new (model: IModel, presenter: IPresenter, addition: tAddition): T }
  ): void {
    const { values } = props;
    for (let index = 0; index < count; index += 1) {
      if (views[index]) {
        views[index].setModel(this.model);
      } else {
        views[index] = new c(this.model, this.presenter, { index });
      }
    }
    this.cleanSubView(views, count);
  }

  private cleanSubView(views: IView[], count: number): void {
    const length = views.length;
    if (length > count) {
      for (let i = count; i < length; i += 1) {
        if (views[i]) {
          views[i].remove();
        }
      }
    }
    return;
  }

  private appendSubViews(view: JQuery<HTMLElement>): void {
    view.empty();
    this.appendSubView(view, this.tracks);
    this.appendSubView(view, this.handles);
    this.appendSubView(view, this.dots);
    this.appendSubView(view, this.rails);
    this.appendSubView(view, this.marks);
    return;
  }

  private appendSubView(view: JQuery<HTMLElement>, subViews: IView[]): void {
    for (const subView of subViews) {
      const v = subView.render();
      if (v) {
        view.append(v);
      }
    }
  }

  private getCount(props: tDefaultProps, views: IView[]): number {
    const { values } = props;
    let count = 0;
    if (values) {
      count = values.length;
    }
    if (views) {
      const length = views.length;
      count = length > count ? length : count;
    }
    console.log("count : ", count);
    return count;
  }

  private handlersOn = (): void => {
    this.view.on({
      click: this.onClick,
    });
    // $(window).on({
    //   mousedown: this.onMouseDown,
    //   mouseup: this.onMouseUp,
    //   mousemove: this.onMousemove,
    // });
  };

  private handlersOff = (): void => {
    this.view.off({
      click: this.onClick,
    });
    // $(window).off({
    //   mousedown: this.onMouseDown,
    //   mouseup: this.onMouseUp,
    //   mousemove: this.onMousemove,
    // });
  };

  private onClick = (e: JQuery.ClickEvent): void => {
    const props = this.model.getProps();
    const { values, vertical } = props;
    if (
      values.length === 1 &&
      !$(e.target).closest(this.handles[0].render()).length
    ) {
      this.currentHandleView = this.handles[0];
      const prevValue = values[0];
      const position = getMousePosition(vertical, e);
      const nextValue = this.calcValueByPos(position, props);
      if (nextValue !== prevValue) {
        // this.presenter.onBeforeChange(prevValue);
        this.onChange(e);
        // this.presenter.onAfterChange(prevValue);
      }
    }
    this.clearCurrentHandleView();
  };

  private onChange(e: JQuery.ClickEvent): void {
    // TODO e interface;
    if (!this.currentHandleView) {
      return;
    }
    const props = this.model.getProps();
    const { vertical } = props;
    let { values } = props;
    const { index } = this.currentHandleView.getAddition();
    const prevValue = props.values[index];
    const position = getMousePosition(vertical, e);
    const nextValue = this.calcValueByPos(position, props);
    if (prevValue !== nextValue) {
      values = values.slice(0);
      values[index] = nextValue;
      this.presenter.onChange(values);
    }
  }

  private clearCurrentHandleView = () => {
    this.currentHandleView = undefined;
  };

  private getSliderStart(props: tDefaultProps): number {
    const slider = this.view.get(0);
    const { vertical, reverse } = props;
    const rect = slider.getBoundingClientRect();
    if (vertical) {
      return reverse ? rect.bottom : rect.top;
    }
    return window.pageXOffset + (reverse ? rect.right : rect.left);
  }

  private calcValueByPos(position: number, props: tDefaultProps): number {
    const { reverse, min, max } = props;
    const sign = reverse ? -1 : +1;
    const pixelOffset = sign * (position - this.getSliderStart(props));
    let value = ensureValueInRange(this.calcValue(pixelOffset, props), {
      min,
      max,
    });
    value = this.calcValueWithEnsure(value);
    return value;
  }

  private checkNeighbors = (
    allowCross: boolean | undefined,
    value: number[]
  ) => {
    return !allowCross && value.length > 1;
  };

  private ensureValueCorrectNeighbors = (
    value: number,
    index?: number
  ): number => {
    const { allowCross, values, pushable, min, max } = this.model.getProps();
    if (this.currentHandleView) {
      const tprops = this.currentHandleView.getAddition();
      const { index: i } = tprops;
      index = i;
    }
    if (this.checkNeighbors(allowCross, values) && index !== undefined) {
      const prevHandle = this.handles[index - 1];
      const nextHandle = this.handles[index + 1];
      let prevValue;
      let nextValue;
      if (prevHandle) {
        prevValue = values[prevHandle.getAddition().index];
        prevValue = pushable ? prevValue + pushable : prevValue;
      }
      if (nextHandle) {
        nextValue = values[nextHandle.getAddition().index];
        nextValue = pushable ? nextValue - pushable : nextValue;
      }
      value = ensureValueInRange(value, {
        min: prevValue || min,
        max: nextValue || max,
      });
    }
    return value;
  };

  private ensureValuePrecision = (v: number): number => {
    const props = this.model.getProps();
    const { step, min, max } = props;
    if (!step) {
      return v;
    }
    const closestPoint = isFinite(this.getClosestPoint(v, { step, min, max }))
      ? this.getClosestPoint(v, { step, min, max })
      : 0;
    // TODO
    // return !step
    //   ? closestPoint
    //   : parseFloat(closestPoint.toFixed(this.getPrecision(step)));
    return parseFloat(closestPoint.toFixed(this.getPrecision(step)));
  };

  getClosestPoint(
    val: number,
    { step, min, max }: { step: number | undefined; min: number; max: number }
  ): number {
    let points: number[] | undefined;
    const values = get(this.model.getProps(), ["mark", "values"]);
    if (values) {
      points = values;
    }
    if (!points) {
      points = [];
    }
    if (step) {
      const baseNum = 10 ** this.getPrecision(step);
      const maxSteps = Math.floor(
        (max * baseNum - min * baseNum) / (step * baseNum)
      );
      const steps = Math.min((val - min) / step, maxSteps);
      const closestStep = Math.round(steps) * step + min;
      points.push(closestStep);
    }
    const diffs = points.map((point) => Math.abs(val - point));
    return points[diffs.indexOf(Math.min(...diffs))];
  }

  private getPrecision = (step: number): number => {
    const stepString = step.toString();
    let precision = 0;
    if (stepString.indexOf(".") >= 0) {
      precision = stepString.length - stepString.indexOf(".") - 1;
    }
    return precision;
  };

  private calcValueWithEnsure(value: number, index?: number): number {
    value = this.ensureValuePrecision(value);
    value = this.ensureValueCorrectNeighbors(value, index);
    return value;
  }

  private getSliderLength() {
    const slider = this.view.get(0);
    const { vertical } = this.model.getProps();
    const coords = slider.getBoundingClientRect();
    return vertical ? coords.height : coords.width;
  }

  private calcValue(offset: number, props: tDefaultProps) {
    const { vertical, min, max, precision } = props;
    const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
    const value = vertical
      ? (1 - ratio) * (max - min) + min
      : ratio * (max - min) + min;
    return Number(value.toFixed(precision));
  }

  public setModel = (model: IModel): void => {
    this.model = model;
    this.updateView(this.model.getProps());
  };

  public render = (): JQuery<HTMLElement> => {
    return this.view;
  };

  public remove(): void {}
}
