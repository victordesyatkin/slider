import { ITrackView, ITrackModel } from "./interface";

export default class TrackView implements ITrackView {
  private model: ITrackModel;
  constructor(model: ITrackModel) {
    this.model = model;
  }
  render(): string {
    return `<div class="${this.model.getClass()}" style=${this.model.getStyle()}> </div>`;
  }
}
