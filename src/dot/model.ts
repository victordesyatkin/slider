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
}
