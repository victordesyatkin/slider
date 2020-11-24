import {
  ITrackPresenter,
  ITrackProps,
  ITrackModel,
  ITrackView,
} from "./interface";
import TrackModel from "./model";
import TrackView from "./view";

export default class TrackPresenter implements ITrackPresenter {
  private model: ITrackModel;

  private view: ITrackView;

  prepareElStyle(props: ITrackProps): { [key: string]: string } {
    const { vertical, style } = props;
    let { length, offset, reverse } = props;

    if (length < 0) {
      reverse = !reverse;
      length = Math.abs(length);
      offset = 100 - offset;
    }

    const positonStyle = vertical
      ? {
          [reverse ? "top" : "bottom"]: `${offset}%`,
          [reverse ? "bottom" : "top"]: "auto",
          height: `${length}%`,
        }
      : {
          [reverse ? "right" : "left"]: `${offset}%`,
          [reverse ? "left" : "right"]: "auto",
          width: `${length}%`,
        };

    const elStyle = {
      ...style,
      ...positonStyle,
    };

    return elStyle;
  }

  public getModel(): ITrackModel {
    return this.model;
  }

  public setModel(model: ITrackModel): void {
    this.model = model;
  }

  public getView(): ITrackView {
    return this.view;
  }

  public setView(view: TrackView): void {
    this.view = view;
  }

  constructor(props: ITrackProps) {
    const elStyle = this.prepareElStyle(props);
    this.model = new TrackModel({
      ...props,
      style: elStyle,
    });
    this.view = new TrackView(this.model);
  }

  render(): string {
    return this.view.render();
  }
}
