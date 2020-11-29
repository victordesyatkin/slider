import { ITooltipModel, ITooltipPropsModel } from "./interface";

export default class TooltipModel implements ITooltipModel {
  private props: ITooltipPropsModel;

  constructor(props: ITooltipPropsModel) {
    this.props = props;
  }

  getProps(): ITooltipPropsModel {
    return this.props;
  }

  setProps(props: ITooltipPropsModel) {
    return (this.props = props);
  }

  get clasName(): string {
    return this.props.className;
  }

  set clasName(clasName: string) {
    this.props.className = clasName;
  }

  get style(): string | undefined {
    return this.props.style;
  }

  set style(style: string | undefined) {
    this.props.style = style;
  }
}
