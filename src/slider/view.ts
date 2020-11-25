import $ from "jquery";
import { ISliderModel } from "./interface";
import { objectToString } from "../utils";
import {
  ITrackPresenter,
  ITrackModel,
  ITrackProps,
  ITrackView,
} from "../track/interface";

export default class SliderView {
  private slideModel: ISliderModel;

  private trackPresenter: ITrackPresenter;

  private slideView: JQuery<HTMLElement>;

  private trackView: ITrackView;

  constructor(slideModel: ISliderModel, trackPresenter: ITrackPresenter) {
    this.slideModel = slideModel;
    this.trackPresenter = trackPresenter;
    this.trackView = this.createTrackView();
    this.slideView = this.createSlideView();
  }

  createSlideView() {
    const props = this.slideModel.getProps();
    return $("<div/>", {
      class: this.slideModel.getSliderClassName(),
    }).append(
      $("<div/>", {
        class: `${props.prefixCls}__rail`,
        style: objectToString(props.railStyle),
      }).append(this.trackView.getView())
    );
  }

  createTrackView() {
    return this.trackPresenter.getView();
  }

  setSlideModel(slideModel: ISliderModel): void {
    this.slideModel = slideModel;
  }

  getSlideModel(): ISliderModel {
    return this.slideModel;
  }

  setTrackPresenter(presenter: ITrackPresenter): void {
    this.trackPresenter = presenter;
  }

  getITrackPresenter(): ITrackPresenter {
    return this.trackPresenter;
  }

  render(): string {
    return $("<div/>").append(this.slideView).html();
  }
}
