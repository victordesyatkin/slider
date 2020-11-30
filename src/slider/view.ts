import $ from "jquery";
import { ISliderModel } from "./interface";
import { ITrackPresenter } from "../track/interface";
import { IHandlePresenter } from "../handle/interface";
// import { IDotsPresenter, IDotsProps } from "../dots/interface";
// import { IMarksPresenter } from "../marks/interface";
import { objectToString } from "../utils";

export default class SliderView {
  private sliderModel: ISliderModel;

  private sliderView: JQuery<HTMLElement>;

  constructor(slideModel: ISliderModel) {
    this.sliderModel = slideModel;
    this.sliderView = this.createSliderView();
  }

  createSliderView(): JQuery<HTMLElement> {
    const view = this.append($("<div/>", this.prepareAttr()));
    return view;
  }

  private map(v: ITrackPresenter | IHandlePresenter): JQuery<HTMLElement> {
    return v.get$View();
  }

  private prepareChildren(): JQuery<HTMLElement>[] | undefined {
    let children = this.sliderModel.getChildren();
    if (Array.isArray(children)) {
      return children.reduce((acc: JQuery<HTMLElement>[], child: any) => {
        if (Array.isArray(child)) {
          const _acc = child.map(this.map);
          acc = [...acc, ..._acc];
        } else {
          child.get$View && acc.push(child.get$View());
        }
        return acc;
      }, new Array());
    }
    return undefined;
  }

  private append(view: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const props = this.sliderModel.getProps();
    view.empty().append(
      $("<div/>", {
        class: `${props.prefixCls}__rail`,
        style: objectToString(props.railStyle),
      })
    );
    const children = this.prepareChildren();
    if (Array.isArray(children)) {
      view.append(children);
    }
    return view;
  }

  private prepareAttr = (): { class: string } => {
    return {
      class: this.sliderModel.getSliderClassName(),
    };
  };

  public updateSliderView = (): void => {
    this.append(this.sliderView.attr(this.prepareAttr()));
  };

  setSliderModel(slideModel: ISliderModel): void {
    this.sliderModel = slideModel;
  }

  getSliderModel(): ISliderModel {
    return this.sliderModel;
  }

  get$SliderView(): JQuery<HTMLElement> {
    return this.sliderView;
  }

  html(): string {
    return $("<div/>").append(this.sliderView).html();
  }
}
