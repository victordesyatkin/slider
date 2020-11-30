export interface ITrackProps {
  className: string;
  offset: number;
  reverse: boolean;
  vertical: boolean;
  length: number;
  style: { [key: string]: string } | undefined;
  included: boolean;
}

export interface ITrackModelProps extends ITrackProps {
  style: { [key: string]: string };
}

export interface ITrackModel {
  getClassName(): string;
  setClassName(className: string): void;
  getStyle(): string;
  setStyle(style: { [key: string]: string }): void;
  getIncluded(): boolean;
  setIncluded(included: boolean): void;
  getProps(): ITrackModelProps;
  setProps(props: ITrackModelProps): void;
}

export interface ITrackView {
  setModel(model: ITrackModel): void;
  getModel(): ITrackModel;
  html(): string;
  get$View(): JQuery<HTMLElement>;
  updateModel(model: ITrackModel): void;
  destroy(): void;
}

export interface ITrackPresenter {
  getModel(): ITrackModel;
  setModel(model: ITrackModel): void;
  getView(): ITrackView;
  setView(view: ITrackView): void;
  get$View(): JQuery<HTMLElement>;
  html(): string;
  updateModel(props: ITrackProps): void;
  destroy(): void;
}
