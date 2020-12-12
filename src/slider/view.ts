import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import {
  objectToString,
  getMousePosition,
  ensureValueInRange,
  ensureValuePrecision,
  getCount,
  getSliderStart,
  getSliderLength,
  calcValue,
  calcValueByPos,
} from "../helpers/utils";
import PubSub from "../helpers/pubsub";
import RailView from "../components/rail/view";
import HandleView from "../components/handle/view";
import TrackView from "../components/track/view";
import DotsView from "../components/dots/view";
import MarksView from "../components/marks/view";

import { DefaultProps, Addition } from "../types";
import { IView, ISubView } from "./interface";
export default class View extends PubSub {
  private parent?: JQuery<HTMLElement>;
  private props?: DefaultProps;
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

  private onClick = (index: number, e: MouseEvent, value?: number) => {
    e.preventDefault();
    if (this.props && this.view) {
      let v: number;
      if (!isUndefined(value)) {
        v = value;
      } else {
        const vertical = get(this.props, ["vertical"], false);
        const position = getMousePosition(vertical, e as MouseEvent);
        v = calcValueByPos({
          position,
          view: this.view,
          props: this.props,
          index,
        });
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
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (this.props && !isUndefined(this.currentHandleIndex) && this.view) {
      const index = this.currentHandleIndex;
      const { vertical, values } = this.props;
      const prevValue = values[index];
      const position = getMousePosition(vertical, e);
      const nextValue = calcValueByPos({
        position,
        view: this.view,
        props: this.props,
        index,
      });
      if (prevValue !== nextValue) {
        const v = [...values];
        v[index] = nextValue;
        this.publish("setPropsModel", v);
      }
    }
  };

  private createOrUpdateSubViews(): void {
    const count = getCount(this.props);
    this.createOrUpdateSubView<RailView>(this.rails, 1, RailView);
    this.createOrUpdateSubView<HandleView>(this.handles, count, HandleView);
    this.createOrUpdateSubView<TrackView>(
      this.tracks,
      count - 1 || 1,
      TrackView
    );
    this.createOrUpdateSubView<DotsView>(this.dots, 1, DotsView);
    this.createOrUpdateSubView<MarksView>(this.marks, 1, MarksView);
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    count: number,
    c: { new (addition: Addition): T }
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

  public setProps(props: DefaultProps): void {
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
