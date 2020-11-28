import { IDotsModel, IDotsProps, IDotsModelProps } from "./interface";

export default class DotModel implements IDotsModel {
  private props: IDotsModelProps;

  constructor(props: IDotsModelProps) {
    this.props = props;
  }

  getProps(): IDotsModelProps {
    return this.props;
  }

  setProps(props: IDotsModelProps): void {
    this.props = props;
  }
}
