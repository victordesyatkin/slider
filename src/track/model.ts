import { objectToString } from "../utils";
import { ITrackModel, ITrackModelProps } from "./interface";

export default class TrackModel implements ITrackModel {
  private props: ITrackModelProps;

  constructor(props: ITrackModelProps) {
    this.props = props;
  }

  getProps(): ITrackModelProps {
    return this.props;
  }

  setProps(props: ITrackModelProps): void {
    this.props = props;
  }

  getClassName(): string {
    return this.props.className;
  }

  setClassName(_className: string): void {
    this.props.className = _className;
  }

  getStyle(): string {
    return objectToString(this.props.style);
  }

  setStyle(_style: { [key: string]: string }): void {
    this.props.style = _style;
  }

  getIncluded(): boolean {
    return this.props.included;
  }

  setIncluded(_included: boolean): void {
    this.props.included = _included;
  }
}
