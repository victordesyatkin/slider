import { IMarksModel, IMarksPropsModel } from "./interface";

export default class MarkModel implements IMarksModel {
  private props: IMarksPropsModel;

  constructor(props: IMarksPropsModel) {
    this.props = props;
  }

  getProps(): IMarksPropsModel {
    return this.props;
  }

  setProps(props: IMarksPropsModel) {
    return (this.props = props);
  }

  get clasName(): string | undefined {
    return this.props.className;
  }

  set clasName(clasName: string | undefined) {
    this.props.className = clasName;
  }

  get style(): { [key: string]: string } | undefined {
    return this.props.style;
  }

  set style(style: { [key: string]: string } | undefined) {
    this.props.style = style;
  }
}
