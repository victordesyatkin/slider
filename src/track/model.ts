import { objectToString } from "../utils";
import { ITrackModel, ITrackProps } from "./interface";

export default class TrackModel implements ITrackModel {
  private className: string;

  private style: { [key: string]: string };

  private included: boolean;

  constructor(props: ITrackProps) {
    const { className, style, included } = props;
    this.className = className;
    this.style = style;
    this.included = included;
  }

  getClassName(): string {
    return this.className;
  }

  setClassName(_className: string): void {
    this.className = _className;
  }

  getStyle(): string {
    return objectToString(this.style);
  }

  setStyle(_style: { [key: string]: string }): void {
    this.style = _style;
  }

  getIncluded(): boolean {
    return this.included;
  }

  setIncluded(_included: boolean): void {
    this.included = _included;
  }
}
