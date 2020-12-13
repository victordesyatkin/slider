import $ from "jquery";
import get from "lodash/get";
import uniq from "lodash/uniq";
import orderBy from "lodash/orderBy";
import isArray from "lodash/isArray";
import { ISubView, IView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import DotView from "../dot/view";
import classnames from "classnames";

export default class DotsView implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private dots: ISubView[] = [];

  constructor(addition: Addition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      const on = get(this.props, ["dot", "on"]);
      const step = get(this.props, ["step"]);
      if (on && step) {
        this.view = $("<div/>", this.prepareAttr());
      }
    }
  }

  private prepareAttr = (): {
    class: string | undefined;
    style: string | undefined;
  } => {
    const attr: { class: string | undefined; style: string | undefined } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
    return attr;
  };

  private prepareClassName = (): string => {
    const prefixCls = get(this.props, ["prefixCls"], "");
    const className = get(this.props, ["dot", "wrapClassName"]);
    const vertical = get(this.props, ["vertical"]);
    return classnames(`${prefixCls}__dots`, className, {
      [`${prefixCls}__dots_vertical`]: vertical,
    });
  };

  private prepareStyle = (): string | undefined => {
    return;
  };

  private updateView(): void {
    if (this.view) {
      this.view.attr(this.prepareAttr());
    } else {
      this.createView();
    }
  }

  private createOrUpdateSubViews() {
    this.createOrUpdateSubView<DotView>(this.dots, DotView);
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    c: { new (addition: Addition): T }
  ): void {
    if (this.props && this.view) {
      const { min, max, step, reverse } = this.props;
      let values: number[] = [];
      const on = get(this.props, ["mark", "dot"]);
      if (on) {
        const markValues = get(this.props, ["mark", "values"]);
        if (isArray(markValues)) {
          values = markValues;
        }
      }
      if (step) {
        const handlers = this.addition.handlers;
        for (let i = min; i <= max; i += step) {
          values.push(i);
        }
        values = orderBy(uniq(values), reverse ? "desc" : "asc");
        const length = values.length;
        for (let i = 0; i < length; i += 1) {
          if (views[i]) {
            views[i].setProps(this.props);
            views[i].setAddition({ index: i, handlers, value: values[i] });
          } else {
            views[i] = new c({ index: i, handlers, value: values[i] });
            views[i].setProps(this.props);
          }
        }
      }
      this.cleanSubView(views, values.length);
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
      this.appendSubView(this.dots);
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

  public setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
  };

  public render = (parent: JQuery<HTMLElement>): void => {
    if (parent && this.view) {
      parent.append(this.view);
    }
  };

  public remove = () => {
    if (this.view) {
      this.view.remove();
    }
  };

  public getAddition = (): Addition => {
    return this.addition;
  };

  public setAddition = (addition: Addition): void => {
    this.addition = addition;
  };
}
