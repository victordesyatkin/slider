import { IMarkModel, IMarkProps } from "./interface";

export default class MarkModel implements IMarkModel {
  private props: IMarkProps;

  constructor(props: IMarkProps) {
    this.props = props;
  }

  getProps(): IMarkProps {
    return this.props;
  }

  setProps(props: IMarkProps) {
    return (this.props = props);
  }

  get clasName(): string {
    return this.props.className;
  }

  set clasName(clasName: string) {
    this.props.className = clasName;
  }

  get style(): { [key: string]: string } | undefined {
    return this.props.style;
  }

  set style(style: { [key: string]: string } | undefined) {
    this.props.style = style;
  }
}
