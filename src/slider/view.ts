import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import {
  objectToString,
  getMousePosition,
  getCount,
  calcValueByPos,
  calcValueWithEnsure,
} from "../helpers/utils";
import PubSub from "../helpers/pubsub";
import RailView from "../components/rail/view";
import HandleView from "../components/handle/view";
import TrackView from "../components/track/view";
import DotsView from "../components/dots/view";
import MarksView from "../components/marks/view";

import { DefaultProps, Addition } from "../types";
import { IView, ISubView } from "./interface";
export default class View extends PubSub implements IView {
  props?: DefaultProps;
  view?: JQuery<HTMLElement>;
  rails: ISubView[] = [];
  tracks: ISubView[] = [];
  handles: ISubView[] = [];
  dots: ISubView[] = [];
  marks: ISubView[] = [];
  currentHandleIndex?: number;
  parent?: JQuery<HTMLElement>;
  isRendered: boolean = false;

  constructor() {
    super();
  }

  createView(): void {
    this.view = $("<div/>", this.prepareAttr());
  }

  updateView = (): void => {
    if (!this.view) {
      this.createView();
    } else {
      this.view.attr(this.prepareAttr());
    }
  };

  prepareAttr = (): { class: string; style: string } => {
    return {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
  };

  prepareClassName(): string {
    const { prefixCls, mark, disabled, vertical, classNames } =
      this.props || {};
    return classnames(prefixCls, {
      [`${prefixCls}_with-mark`]: get(mark, ["show"]),
      [`${prefixCls}_disabled`]: disabled,
      [`${prefixCls}_vertical`]: vertical,
      classNames,
    });
  }

  prepareStyle(): string {
    return objectToString({ ...get(this.props, ["style"]) });
  }

  onClick = (index: number, e: MouseEvent, value?: number): void => {
    e.preventDefault();
    const disabled = get(this.props, ["disabled"]);
    if (disabled) {
      return;
    }
    if (this.props && this.view) {
      let v: number;
      if (!isUndefined(value)) {
        if (this.props.values.length === 1) {
          v = value;
        } else if (
          !isUndefined(this.currentHandleIndex) &&
          this.props.values.length > 1
        ) {
          v = calcValueWithEnsure({
            value,
            props: this.props,
            index: this.currentHandleIndex,
          });
        } else {
          return;
        }
      } else {
        const vertical = get(this.props, ["vertical"], false);
        const position = getMousePosition(vertical, e as MouseEvent);
        v = calcValueByPos({
          position,
          view: this.view,
          props: this.props,
          index: this.currentHandleIndex || index,
        });
      }
      if (this.props.values.length === 1 && this.props.values[0] !== v) {
        const values: number[] = [v];
        this.publish("setPropsModel", values);
        this.publish("onMouseUp", values);
      } else if (
        this.props.values.length > 1 &&
        !isUndefined(this.currentHandleIndex) &&
        this.props.values[this.currentHandleIndex] !== v
      ) {
        const values: number[] = [...this.props.values];
        values[this.currentHandleIndex] = v;
        this.publish("setPropsModel", values);
        this.publish("onMouseUp", values);
      }
    }
  };

  onMouseDown = (index: number, e: MouseEvent): void => {
    e.preventDefault();
    const disabled = get(this.props, ["disabled"]);
    if (disabled) {
      return;
    }
    this.currentHandleIndex = index;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.publish("onMouseDown", this.props?.values || []);
  };

  onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    const disabled = get(this.props, ["disabled"]);
    if (disabled) {
      return;
    }
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.publish("onMouseUp", this.props?.values || []);
  };

  onMouseMove = (e: MouseEvent): void => {
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

  createOrUpdateSubViews = (): void => {
    const count = getCount(this.props);
    this.createOrUpdateSubView<RailView>(this.rails, 1, RailView, "click");
    this.createOrUpdateSubView<TrackView>(
      this.tracks,
      count - 1 || 1,
      TrackView
    );
    this.createOrUpdateSubView<DotsView>(this.dots, 1, DotsView, "click");
    this.createOrUpdateSubView<MarksView>(this.marks, 1, MarksView, "click");
    this.createOrUpdateSubView<HandleView>(
      this.handles,
      count,
      HandleView,
      "mousedown"
    );
  };

  createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    count: number,
    c: { new (addition: Addition): T },
    action?: string
  ): void {
    if (this.props) {
      let handlers;
      let active;
      if (action === "mousedown") {
        handlers = {
          mousedown: this.onMouseDown,
        };
      } else if (
        action === "click" ||
        action === "click" ||
        action === "click"
      ) {
        if (this.props.values.length > 0) {
          handlers = {
            click: this.onClick,
          };
        }
      }
      for (let index = 0; index < count; index += 1) {
        if (c.name === "mousedown") {
          active = index === this.currentHandleIndex;
        }

        if (views[index]) {
          let addition = views[index].getAddition();
          addition = { ...addition, handlers, active };
          views[index].setAddition(addition);
          views[index].setProps(this.props);
        } else {
          views[index] = new c({ index, handlers, active });
          views[index].setProps(this.props);
        }
      }
      this.cleanSubView(views, count);
    }
  }

  cleanSubView(views: IView[], count: number): void {
    const length = views.length;
    if (length > count) {
      for (let i = count; i < length; i += 1) {
        if (views[i]) {
          views[i].remove();
        }
      }
      views.splice(count);
    }
    return;
  }

  appendSubViews(): void {
    if (this.view) {
      this.appendSubView(this.rails);
      this.appendSubView(this.marks);
      this.appendSubView(this.dots);
      this.appendSubView(this.tracks);
      this.appendSubView(this.handles);
    }
    return;
  }

  appendSubView(subViews: IView[]): void {
    if (this.view) {
      for (const subView of subViews) {
        subView.render(this.view);
      }
    }
  }

  setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
  }

  render = (parent?: JQuery<HTMLElement>): void => {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered && this.parent && this.view) {
      this.parent.append(this.view);
      this.isRendered = true;
    }
  };

  remove = (): void => {};
}
