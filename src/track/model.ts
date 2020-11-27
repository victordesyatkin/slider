import { objectToString } from "../utils";
import { ITrackModel, ITrackModelProps } from "./interface";

export default class TrackModel implements ITrackModel {
  private className: string;

  private style: { [key: string]: string };

  private props: ITrackModelProps;

  private included: boolean;

  constructor(props: ITrackModelProps) {
    const { className, style, included } = props;
    this.className = className;
    this.style = style;
    this.included = included;
    this.props = props;
  }

  getProps(): ITrackModelProps {
    return this.props;
  }

  setProps(props: ITrackModelProps): void {
    this.props = props;
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
