export interface ITrackProps {
  className: string;
  offset: number;
  reverse: boolean;
  vertical: boolean;
  length: number;
  style: { [key: string]: string };
  included: boolean;
}

export interface ITrackModel {
  getClassName(): string;
  setClassName(className: string): void;
  getStyle(): string;
  setStyle(style: { [key: string]: string }): void;
  getIncluded(): boolean;
  setIncluded(included: boolean): void;
}

export interface ITrackView {
  setModel(model: ITrackModel): void;
  getModel(): ITrackModel;
  html(): string;
  get$View(): JQuery<HTMLElement>;
}

export interface ITrackPresenter {
  getModel(): ITrackModel;
  setModel(model: ITrackModel): void;
  getView(): ITrackView;
  setView(view: ITrackView): void;
  get$View(): JQuery<HTMLElement>;
  prepareElStyle(props: ITrackProps): { [key: string]: string };
  html(): string;
}
