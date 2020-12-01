import classnames from "classnames";
import uniq from "lodash/uniq";
import MarkModel from "./model";
import MarkView from "./view";
import { IMarkPresenter } from "../mark/interface";
import MarkPresenter from "../mark/presenter";
import {
  IMarksModel,
  IMarksProps,
  IMarksView,
  IMarksPropsModel,
} from "./interface";
import { calcOffset } from "../utils";

export default class MarksPresenter {
  private model: IMarksModel;
  private view: IMarksView;

  constructor(props: IMarksProps) {
    const _props = this.preparePropsForModel(props);
    this.model = new MarkModel(_props);
    this.view = new MarkView(this.model);
  }

  public getAdditionValues(): number[] | undefined {
    return this.model.getProps().values;
  }

  private preparePropsForModel(props: IMarksProps): IMarksPropsModel {
    return {
      ...props,
      className: classnames(props.className, `${props.prefixCls}__marks`),
      items: this.factoryItems(props),
      style: this.prepareStyle(props),
    };
  }

  private factoryItems = (props: IMarksProps): IMarkPresenter[] | undefined => {
    const {
      max,
      min,
      step,
      prefixCls,
      style,
      render,
      onClick,
      values,
      show,
    } = props;
    if (!show) {
      return;
    }
    let _values = new Array();
    const items = new Array();
    if (values !== undefined) {
      _values = values.sort((a, b) => a - b);
    }
    if (step) {
      for (let i = min; i <= max; i += step) {
        _values.push(i);
      }
    }
    _values = uniq(_values);
    if (!_values.length) {
      return undefined;
    }
    const className = `${prefixCls}__mark`;
    for (let value of _values) {
      let label = `${value}`;
      const offset = calcOffset(value, min, max);
      if (render !== undefined) {
        label = render(value);
      }
      items.push(
        new MarkPresenter({
          className,
          label,
          offset,
          style,
          onClick,
          value,
        })
      );
    }
    return items;
  };

  private prepareStyle(props: any): { [key: string]: string } | undefined {
    const { vertical } = props;
    return;
  }

  getModel(): IMarksModel {
    return this.model;
  }

  setModel(model: IMarksModel): void {
    this.model = model;
  }

  updateModel(props: IMarksProps): void {
    const _props = this.preparePropsForModel(props);
    this.model.setProps(_props);
    this.view.updateModel(this.model);
  }

  public getView(): IMarksView {
    return this.view;
  }

  public setView(view: IMarksView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  html(): string {
    return this.view.html();
  }
}
