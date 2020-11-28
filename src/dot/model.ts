import { IDotModel, IDotPropsModel } from "./interface";

export default class DotModel implements IDotModel {
  private props: IDotPropsModel;

  constructor(props: IDotPropsModel) {
    this.props = props;
  }

  getProps(): IDotPropsModel {
    return this.props;
  }

  setProps(props: IDotPropsModel) {
    return (this.props = props);
  }

  get clasName(): string {
    return this.props.className;
  }

  set clasName(clasName: string) {
    this.props.className = clasName;
  }

  get style() {
    return this.props.style;
  }

  set Style(style: { [key: string]: string }) {
    this.props.style = style;
  }
}
