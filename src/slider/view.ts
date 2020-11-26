import $ from "jquery";
import { ISliderModel } from "./interface";
import { objectToString } from "../utils";
import {
  ITrackPresenter,
  ITrackModel,
  ITrackProps,
  ITrackView,
} from "../track/interface";

import HandlePresenter from "../handle/presenter";
import { IHandlePresenter, IHandleView } from "../handle/interface";

export default class SliderView {
  private sliderModel: ISliderModel;

  private sliderView: JQuery<HTMLElement>;

  private trackPresenter: ITrackPresenter;

  private trackView: ITrackView;

  private handlePresenter: IHandlePresenter;

  private handleView: IHandleView;

  constructor(
    slideModel: ISliderModel,
    trackPresenter: ITrackPresenter,
    handlePresenter: IHandlePresenter
  ) {
    this.sliderModel = slideModel;
    this.trackPresenter = trackPresenter;
    this.handlePresenter = handlePresenter;
    this.trackView = this.createTrackView();
    this.handleView = this.createHandleView();
    this.sliderView = this.createSliderView();
  }

  createSliderView() {
    const props = this.sliderModel.getProps();
    return $("<div/>", {
      class: this.sliderModel.getSliderClassName(),
    }).append(
      $("<div/>", {
        class: `${props.prefixCls}__rail`,
        style: objectToString(props.railStyle),
      })
        .append(this.trackView.get$View())
        .append(this.handleView.get$View())
    );
  }

  createHandleView(): IHandleView {
    return this.handlePresenter.getView();
  }

  createTrackView(): ITrackView {
    return this.trackPresenter.getView();
  }

  setSliderModel(slideModel: ISliderModel): void {
    this.sliderModel = slideModel;
  }

  getSliderModel(): ISliderModel {
    return this.sliderModel;
  }

  setTrackPresenter(presenter: ITrackPresenter): void {
    this.trackPresenter = presenter;
  }

  getITrackPresenter(): ITrackPresenter {
    return this.trackPresenter;
  }

  get$SliderView(): JQuery<HTMLElement> {
    return this.sliderView;
  }

  html(): string {
    return $("<div/>").append(this.sliderView).html();
  }
}
