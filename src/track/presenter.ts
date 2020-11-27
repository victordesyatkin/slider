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

  constructor(props: ITrackProps) {
    const elStyle = this.prepareElStyle(props);
    this.model = new TrackModel({
      ...props,
      style: elStyle,
    });
    this.view = new TrackView(this.model);
  }

  public prepareElStyle(props: ITrackProps): { [key: string]: string } {
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

  public updateModel(props: ITrackProps): void {
    this.model.setProps({
      ...props,
      style: this.prepareElStyle(props),
    });
    this.view.updateModel(this.model);
  }

  public getView(): ITrackView {
    return this.view;
  }

  public setView(view: ITrackView): void {
    this.view = view;
  }

  public get$View(): JQuery<HTMLElement> {
    return this.view.get$View();
  }

  public html(): string {
    return this.view.html();
  }
}
