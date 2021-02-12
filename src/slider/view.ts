import $ from "jquery";
import bind from "bind-decorator";
import classnames from "classnames";
import get from "lodash/get";

import {
  objectToString,
  getCount,
  getSliderStart,
  getSliderLength,
} from "../helpers/utils";
import PubSub from "../helpers/pubsub";
import RailView from "../components/rail/view";
import HandleView from "../components/handle/view";
import TrackView from "../components/track/view";
import DotsView from "../components/dots/view";
import MarksView from "../components/marks/view";
import { DefaultPropsView, Addition } from "../types";
import { IView, ISubView } from "./interface";
class View extends PubSub implements IView {
  props?: DefaultPropsView;
  view?: JQuery<HTMLElement>;
  rails: ISubView[] = [];
  tracks: ISubView[] = [];
  handles: ISubView[] = [];
  dots: ISubView[] = [];
  marks: ISubView[] = [];
  parent?: JQuery<HTMLElement>;
  isRendered: boolean = false;

  constructor() {
    super();
  }

  public setProps(props: DefaultPropsView): void {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
  }

  public render(parent?: JQuery<HTMLElement>): void {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered && this.parent && this.view) {
      this.parent.append(this.view);
      this.isRendered = true;
    }
  }

  public remove(): void {}

  private createView(): void {
    this.view = $("<div/>", this.prepareAttr());
  }

  private updateView(): void {
    if (!this.view) {
      this.createView();
    } else {
      this.view.attr(this.prepareAttr());
    }
  }

  private prepareAttr(): { class: string; style: string } {
    return {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
  }

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

  @bind
  private handleViewClick(
    index: number,
    event: MouseEvent,
    value?: number
  ): void {
    event.preventDefault();
    this.publish("handleViewClick", {
      index,
      event,
      value,
      start: getSliderStart({ props: this.props, view: this.view }),
      length: getSliderLength({ props: this.props, view: this.view }),
    });
  }

  @bind
  private handleViewMouseDown(index: number, event: MouseEvent): void {
    event.preventDefault();
    window.addEventListener("mousemove", this.handleWindowMouseMove);
    window.addEventListener("mouseup", this.handleWindowMouseUp);
    this.publish("handleViewMouseDown", { index });
  }

  @bind
  private handleWindowMouseUp(event: MouseEvent): void {
    event.preventDefault();
    window.removeEventListener("mousemove", this.handleWindowMouseMove);
    window.removeEventListener("mouseup", this.handleWindowMouseUp);
    this.publish("handleWindowMouseUp");
  }

  @bind
  private handleWindowMouseMove(event: MouseEvent): void {
    this.publish("handleWindowMouseMove", {
      event,
      start: getSliderStart({ props: this.props, view: this.view }),
      length: getSliderLength({ props: this.props, view: this.view }),
    });
  }

  private createOrUpdateSubViews(): void {
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
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    count: number,
    subView: { new (addition: Addition): T },
    action?: string
  ): void {
    if (this.props) {
      let handles;
      let active;
      if (action === "mousedown") {
        handles = {
          handleViewMouseDown: this.handleViewMouseDown,
        };
      } else if (action === "click") {
        if (this.props.values.length > 0) {
          handles = {
            handleViewClick: this.handleViewClick,
          };
        }
      }
      for (let index = 0; index < count; index += 1) {
        if (subView.name === "HandleView") {
          active = index === this.props.currentHandleIndex;
        }

        if (views[index]) {
          let addition = views[index].getAddition();
          addition = { ...addition, handles, active };
          views[index].setAddition(addition);
          views[index].setProps(this.props);
        } else {
          views[index] = new subView({ index, handles, active });
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
}

export default View;
