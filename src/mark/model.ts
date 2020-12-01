import { IMarkModel, IMarkPropsModal } from "./interface";

export default class MarkModel implements IMarkModel {
  private props: IMarkPropsModal;

  constructor(props: IMarkPropsModal) {
    this.props = props;
  }

  getProps(): IMarkPropsModal {
    return this.props;
  }

  setProps(props: IMarkPropsModal): void {
    this.props = props;
  }

  get clasName(): string {
    return this.props.className;
  }

  set clasName(clasName: string) {
    this.props.className = clasName;
  }

  get style(): { [key: string]: string } {
    return this.props.style;
  }

  set style(style: { [key: string]: string }) {
    this.props.style = style;
  }
}
