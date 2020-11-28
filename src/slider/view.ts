import $ from "jquery";
import { ISliderModel } from "./interface";
import { objectToString } from "../utils";
import { ITrackPresenter, ITrackView } from "../track/interface";

import { IHandlePresenter, IHandleView } from "../handle/interface";

import DotsPresenter from "../dots/presenter";
import { IDotsView, IDotsPresenter } from "../dots/interface";

export default class SliderView {
  private sliderModel: ISliderModel;

  private sliderView: JQuery<HTMLElement>;

  private trackPresenters: ITrackPresenter[];

  private trackViews: ITrackView[];

  private handlePresenters: IHandlePresenter[];

  private handleViews: IHandleView[];

  private dotsPresenter: IDotsPresenter;

  private dotsView: IDotsView;

  constructor(
    slideModel: ISliderModel,
    trackPresenters: ITrackPresenter[],
    handlePresenters: IHandlePresenter[],
    dotsPresenter: IDotsPresenter
  ) {
    this.sliderModel = slideModel;
    this.trackPresenters = trackPresenters;
    this.handlePresenters = handlePresenters;
    this.dotsPresenter = dotsPresenter;
    this.trackViews = this.createTrackViews();
    this.handleViews = this.createHandleViews();
    this.dotsView = this.createDotsView();
    this.sliderView = this.createSliderView();
  }

  private createDotsView(): IDotsView {
    return this.dotsPresenter.getView();
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
        .append(this.trackViews.map((v) => v.get$View()))
        .append(this.handleViews.map((v) => v.get$View()))
        .append(this.dotsView.get$View())
    );
  }

  createHandleViews(): IHandleView[] {
    return this.handlePresenters.map((handlePresenter) => {
      return handlePresenter.getView();
    });
  }

  createTrackViews(): ITrackView[] {
    return this.trackPresenters.map((trackPresenter) =>
      trackPresenter.getView()
    );
  }

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
