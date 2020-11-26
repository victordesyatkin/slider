import $ from "jquery";
import { ITrackView, ITrackModel } from "./interface";
export default class TrackView implements ITrackView {
  private model: ITrackModel;

  private view; //TODO JQuery<HTMLElement>

  setModel(model: ITrackModel): void {
    this.model = model;
  }

  getModel(): ITrackModel {
    return this.model;
  }

  get$View(): JQuery<HTMLElement> {
    return this.view;
  }

  constructor(model: ITrackModel) {
    this.model = model;
    this.view = this.createView();
  }

  createView() {
    return $("<div/>", {
      class: this.model.getClassName(),
      style: this.model.getStyle(),
    });
  }

  public html(): string {
    return this.model.getIncluded() ? $("<div/>").append(this.view).html() : "";
  }
}
