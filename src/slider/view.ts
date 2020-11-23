import { ITrackPresenter } from "../track/interface";

export default class SliderView {
  constructor(trackPresenter: ITrackPresenter) {}

  render(): string {
    return `<div class="slider">
        ${trackPresenter.render()}
    </div>`;
  }
}
