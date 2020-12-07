import $ from "jquery";
import classnames from "classnames";
import get from "lodash/get";
import PubSub from "../helpers/pubsub";
import { objectToString } from "../helpers/utils";
import { tDefaultProps, tAddition } from "../types";
import { IView, ISubView } from "./interface";
import RailView from "../components/rail/view";
import HandleView from "../components/handle/view";

export default class View extends PubSub {
  private parent?: JQuery<HTMLElement>;
  private props?: tDefaultProps;
  private view?: JQuery<HTMLElement>;
  private rails: ISubView[] = [];
  private tracks: ISubView[] = [];
  private handles: ISubView[] = [];
  private dots: ISubView[] = [];
  private marks: ISubView[] = [];

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

  private handleMouseDown = (index: number, e: JQuery.Event): void => {
    console.log("handleMouseDown index : ", index);
    console.log("handleMouseDown e : ", e);
  };

  private createOrUpdateSubViews(): void {
    this.createOrUpdateSubView<RailView>(this.rails, 1, RailView);
    this.createOrUpdateSubView<HandleView>(
      this.handles,
      this.getCount(this.handles),
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
    views: IView[],
    count: number,
    c: { new (addition: tAddition): T }
  ): void {
    if (this.props) {
      const handlers = {
        mousedown: this.handleMouseDown,
      };
      for (let index = 0; index < count; index += 1) {
        if (views[index]) {
          views[index].setProps(this.props);
        } else {
          views[index] = new c({ index, handlers });
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
      this.view.empty();
      this.appendSubView(this.tracks);
      this.appendSubView(this.handles);
      this.appendSubView(this.dots);
      this.appendSubView(this.rails);
      this.appendSubView(this.marks);
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
    console.log("count : ", count);
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
