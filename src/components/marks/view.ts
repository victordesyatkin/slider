import $ from "jquery";
import get from "lodash/get";
import isArray from "lodash/isArray";
import uniq from "lodash/uniq";
import orderBy from "lodash/orderBy";
import isUndefined from "lodash/isUndefined";
import classnames from "classnames";
import { ISubView } from "../../slider/interface";
import { DefaultProps, Addition } from "../../types";
import MarkView from "../mark/view";

export default class MarksView implements ISubView {
  private props?: DefaultProps;
  private view?: JQuery<HTMLElement>;
  private addition: Addition;
  private marks: MarkView[] = [];

  constructor(addition: Addition) {
    this.addition = addition;
  }

  private createView(): void {
    if (this.props) {
      const on = get(this.props, ["mark", "on"]);
      if (on) {
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
    const className = get(this.props, ["mark", "wrapClassName"]);
    return classnames(`${prefixCls}__marks`, className);
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
    this.createOrUpdateSubView<MarkView>(this.marks, MarkView);
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    c: { new (addition: Addition): T }
  ): void {
    if (this.props && this.view) {
      const { min, max, step, reverse } = this.props;
      let values: number[] = [];
      const markValues = get(this.props, ["mark", "values"]);
      if (isArray(markValues)) {
        values = markValues;
      }
      if (step) {
        for (let i = min; i <= max; i += step) {
          values.push(i);
        }
        values = orderBy(uniq(values), reverse ? "desc" : "asc");
        const length = values.length;
        const handlers = this.addition.handlers;
        for (let i = 0; i < length; i += 1) {
          if (!isUndefined(views[i])) {
            views[i].setProps(this.props);
            views[i].setAddition({
              index: i,
              handlers,
              value: values[i],
            });
          } else {
            views[i] = new c({
              index: i,
              handlers,
              value: values[i],
            });
            views[i].setProps(this.props);
          }
        }
      }
      this.cleanSubView(views, values.length);
    }
  }

  private cleanSubView(views: ISubView[], count: number): void {
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
      this.appendSubView(this.marks);
    }
    return;
  }

  private appendSubView(subViews: ISubView[]): void {
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
