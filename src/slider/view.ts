import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import PubSub from "../helpers/pubsub";
import {
  objectToString,
  getMousePosition,
  ensureValueInRange,
  ensureValuePrecision,
} from "../helpers/utils";
import { tDefaultProps, tAddition } from "../types";
import { IView, ISubView } from "./interface";
import RailView from "../components/rail/view";
import HandleView from "../components/handle/view";
import TrackView from "../components/track/view";
import DotsView from "../components/dots/view";
import MarksView from "../components/marks/view";
import { add } from "lodash";

export default class View extends PubSub {
  private parent?: JQuery<HTMLElement>;
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private rails: ISubView[] = [];
  private tracks: ISubView[] = [];
  private handles: ISubView[] = [];
  private dots: ISubView[] = [];
  private marks: ISubView[] = [];
  private currentHandleIndex?: number;

  constructor(parent: JQuery<HTMLElement>) {
    super();
    this.parent = parent;
  }

  private createView(): void {
    this.view = $("<div/>", this.prepareAttr());
  }

  private updateView = (): void => {
    if (!this.view) {
      this.createView();
    } else {
      this.view.attr(this.prepareAttr());
    }
  };

  private prepareAttr = (): { class: string; style: string } => {
    return {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
  };

  private prepareClassName(): string {
    const { prefixCls, mark, disabled, vertical, classNames } =
      this.props || {};
    return classnames(prefixCls, {
      [`${prefixCls}_with-mark`]: get(mark, ["show"]),
      [`${prefixCls}_disabled`]: disabled,
      [`${prefixCls}_vertical`]: vertical,
      classNames,
    });
  }

  private prepareStyle(): string {
    return objectToString({ ...get(this.props, ["style"]) });
  }

  private cleanHandleIndex = () => {
    this.currentHandleIndex = undefined;
  };

  private onClick = (index: number, e: MouseEvent, value?: number) => {
    e.preventDefault();
    if (this.props) {
      let v: number;
      if (!isUndefined(value)) {
        v = value;
      } else {
        const vertical = get(this.props, ["vertical"], false);
        const position = getMousePosition(vertical, e as MouseEvent);
        v = this.calcValueByPos(position);
      }
      if (this.props.values[0] !== v) {
        const values: number[] = [v];
        this.publish("setPropsModel", values);
      }
    }
  };

  private onMouseDown = (index: number, e: JQuery.Event): void => {
    e.preventDefault();
    this.currentHandleIndex = index;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
  };

  private onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    //this.cleanHandleIndex();
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (this.props && !isUndefined(this.currentHandleIndex) && this.view) {
      const index = this.currentHandleIndex;
      const { vertical, values } = this.props;
      const prevValue = values[index];
      const position = getMousePosition(vertical, e);
      const nextValue = this.calcValueByPos(position);
      if (prevValue !== nextValue) {
        const v = [...values];
        v[index] = nextValue;
        this.publish("setPropsModel", v);
      }
    }
  };

  private calcValueByPos(position: number): number {
    if (this.props) {
      const { reverse, min, max } = this.props;
      const sign = reverse ? -1 : +1;
      const pixelOffset = sign * (position - this.getSliderStart());
      let value = ensureValueInRange(this.calcValue(pixelOffset), {
        min,
        max,
      });
      value = this.calcValueWithEnsure(value);
      return value;
    }
    return 0;
  }

  private checkNeighbors = (
    allowCross: boolean | undefined,
    value: number[]
  ) => {
    return !allowCross && value.length > 1;
  };

  private ensureValueCorrectNeighbors = (value: number): number => {
    if (this.props && !isUndefined(this.currentHandleIndex)) {
      const { allowCross, values, pushable, min, max } = this.props;
      if (this.checkNeighbors(allowCross, values)) {
        let prevValue = values[this.currentHandleIndex - 1];
        let nextValue = values[this.currentHandleIndex + 1];
        let amin = min;
        let amax = max;
        if (!isUndefined(prevValue)) {
          amin = pushable ? prevValue + pushable : prevValue;
        }
        if (!isUndefined(nextValue)) {
          amax = pushable ? nextValue - pushable : nextValue;
        }
        value = ensureValueInRange(value, {
          min: amin,
          max: amax,
        });
      }
    }
    return value;
  };

  private calcValueWithEnsure(value: number): number {
    value = ensureValuePrecision(value, this.props);
    value = this.ensureValueCorrectNeighbors(value);
    return value;
  }

  private calcValue(offset: number) {
    if (this.props) {
      const { vertical, min, max, precision } = this.props;
      const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
      const value = vertical
        ? (1 - ratio) * (max - min) + min
        : ratio * (max - min) + min;
      return Number(value.toFixed(precision));
    }
    return 0;
  }

  private getSliderLength(): number {
    if (this.view && this.props) {
      const slider = this.view.get(0);
      const { vertical } = this.props;
      const coords = slider.getBoundingClientRect();
      return vertical ? coords.height : coords.width;
    }
    return 0;
  }

  private getSliderStart(): number {
    if (this.props && this.view) {
      const { vertical, reverse } = this.props;
      const rect = this.view.get(0).getBoundingClientRect();
      if (vertical) {
        return reverse ? rect.bottom : rect.top;
      }
      return window.pageXOffset + (reverse ? rect.right : rect.left);
    }
    return 0;
  }

  private createOrUpdateSubViews(): void {
    this.createOrUpdateSubView<RailView>(this.rails, 1, RailView);
    this.createOrUpdateSubView<HandleView>(
      this.handles,
      this.getCount(this.handles),
      HandleView
    );
    this.createOrUpdateSubView<TrackView>(
      this.tracks,
      this.getCount(this.tracks) - 1 || 1,
      TrackView
    );
    this.createOrUpdateSubView<DotsView>(this.dots, 1, DotsView);
    this.createOrUpdateSubView<MarksView>(this.marks, 1, MarksView);
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    count: number,
    c: { new (addition: tAddition): T }
  ): void {
    if (this.props) {
      let handlers;
      let active;
      if (c.name === "HandleView") {
        handlers = {
          mousedown: this.onMouseDown,
        };
      } else if (
        c.name === "RailView" ||
        c.name === "MarksView" ||
        c.name === "DotsView"
      ) {
        if (this.props.values.length === 1) {
          handlers = {
            click: this.onClick,
          };
        }
      }
      for (let index = 0; index < count; index += 1) {
        if (c.name === "HandleView") {
          active = index === this.currentHandleIndex;
        }

        if (views[index]) {
          views[index].setProps(this.props);
          let addition = views[index].getAddition();
          addition = { ...addition, active };
          views[index].setAddition(addition);
        } else {
          views[index] = new c({ index, handlers, active });
          views[index].setProps(this.props);
        }
      }
      this.cleanSubView(views, count);
    }
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

  private appendSubViews(): void {
    if (this.view) {
      this.appendSubView(this.rails);
      this.appendSubView(this.marks);
      this.appendSubView(this.dots);
      this.appendSubView(this.tracks);
      this.appendSubView(this.handles);
    }
    return;
  }

  private appendSubView(subViews: IView[]): void {
    if (this.view) {
      for (const subView of subViews) {
        subView.render(this.view);
      }
    }
  }

  private getCount(views: IView[]): number {
    let count = 0;
    if (this.props) {
      const { values } = this.props;
      if (values) {
        count = values.length;
      }
      if (views) {
        const length = views.length;
        count = length > count ? length : count;
      }
    }
    return count;
  }

  public setProps(props: tDefaultProps): void {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
  }

  public render = () => {
    this.parent && this.view && this.parent.append(this.view);
  };

  public remove = (): void => {};
}
