import { ITrackView, ITrackModel } from "./interface";
export default class TrackView implements ITrackView {
  private model: ITrackModel;

  setModel(model: ITrackModel): void {
    this.model = model;
  }

  getModel(): ITrackModel {
    return this.model;
  }

  constructor(model: ITrackModel) {
    this.model = model;
  }
  public render(): string {
    return this.model.getIncluded()
      ? `<div class="${this.model.getClassName()}" style="${this.model.getStyle()}"></div>`
      : "";
  }
}
