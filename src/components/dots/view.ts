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
  private parent?: JQuery<HTMLElement>;
  private isRendered: boolean = false;

  constructor(addition: Addition) {
    this.addition = addition;
  }

  createView(): void {
    if (this.props) {
      const on = get(this.props, ["dot", "on"]);
      if (on) {
        this.view = $("<div/>", this.prepareAttr());
      }
    }
  }

  prepareAttr = (): {
    class: string | undefined;
    style: string | undefined;
  } => {
    const attr: { class: string | undefined; style: string | undefined } = {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
    return attr;
  };

  prepareClassName = (): string => {
    const prefixCls = get(this.props, ["prefixCls"], "");
    const className = get(this.props, ["dot", "wrapClassName"]);
    const vertical = get(this.props, ["vertical"]);
    return classnames(`${prefixCls}__dots`, className, {
      [`${prefixCls}__dots_vertical`]: vertical,
    });
  };

  prepareStyle = (): string | undefined => {
    return;
  };

  updateView(): void {
    if (this.view) {
      if (get(this.props, ["dot", "on"])) {
        this.view.attr(this.prepareAttr());
      } else {
        this.remove();
      }
    } else {
      this.createView();
    }
  }

  createOrUpdateSubViews() {
    this.createOrUpdateSubView<DotView>(this.dots, DotView);
  }

  createOrUpdateSubView<T extends ISubView>(
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
          values = [...markValues];
        }
      }
      if (step) {
        for (let i = min; i <= max; i += step) {
          values.push(i);
        }
      }
      const handlers = this.addition.handlers;
      values = orderBy(uniq(values), [], reverse ? "desc" : "asc");
      const length = values.length;
      for (let i = 0; i < length; i += 1) {
        if (views[i]) {
          views[i].setAddition({ index: i, handlers, value: values[i] });
          views[i].setProps(this.props);
        } else {
          views[i] = new c({ index: i, handlers, value: values[i] });
          views[i].setProps(this.props);
        }
      }
      this.cleanSubView(views, values.length);
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
      this.appendSubView(this.dots);
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

  setProps = (props: DefaultProps): void => {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
  };

  onClick = (): void => {};

  onHandlers = (): void => {};

  render = (parent?: JQuery<HTMLElement>): void => {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered && this.parent && this.view) {
      this.parent.append(this.view);
      this.isRendered = true;
    }
  };

  remove = () => {
    if (this.view) {
      this.view.remove();
      this.view = undefined;
      this.dots = [];
      this.isRendered = false;
    }
  };

  getAddition = (): Addition => {
    return this.addition;
  };

  setAddition = (addition: Addition): void => {
    this.addition = addition;
  };
}
