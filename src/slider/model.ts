import { tDefaultProps } from "../types";

export default class Model {
  private props: tDefaultProps;

  constructor(props: tDefaultProps) {
    this.props = props;
  }
}
