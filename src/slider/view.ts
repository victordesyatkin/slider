import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import {
  objectToString,
  getMousePosition,
  getCount,
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
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private rails: ISubView[] = [];
  private tracks: ISubView[] = [];
  private handles: ISubView[] = [];
  private dots: ISubView[] = [];
  private marks: ISubView[] = [];
  private currentHandleIndex?: number;
  private parent?: JQuery<HTMLElement>;
  private isRendered: boolean = false;

  constructor() {
    super();
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

  private onClick = (index: number, e: MouseEvent, value?: number): void => {
    console.log("onClick");
    e.preventDefault();
    const disabled = get(this.props, ["disabled"]);
    if (disabled) {
      return;
    }
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
    const disabled = get(this.props, ["disabled"]);
    if (disabled) {
      return;
    }
    this.currentHandleIndex = index;
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.publish("onMouseDown", this.props?.values || []);
  };

  private onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.publish("onMouseUp", this.props?.values || []);
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
    this.createOrUpdateSubView<TrackView>(
      this.tracks,
      count - 1 || 1,
      TrackView
    );
    this.createOrUpdateSubView<DotsView>(this.dots, 1, DotsView);
    this.createOrUpdateSubView<MarksView>(this.marks, 1, MarksView);
    this.createOrUpdateSubView<HandleView>(this.handles, count, HandleView);
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
          // console.log(this.props);
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
      views.splice(count);
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
    console.log(props);
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
  }

  public render = (parent?: JQuery<HTMLElement>): void => {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered && this.parent && this.view) {
      this.parent.append(this.view);
      this.isRendered = true;
    }
  };

  public remove = (): void => {};
}
