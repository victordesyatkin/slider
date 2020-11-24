import { ISliderModel } from "./interface";
import { ITrackPresenter } from "../track/interface";

export default class SliderView {
  private model: ISliderModel;

  constructor(model: ISliderModel) {
    this.model = model;
  } //trackPresenter: ITrackPresenter

  render(): string {
    //${trackPresenter.render()}
    return `<div class="slider">  
    </div>`;
  }
}
