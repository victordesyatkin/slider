import { tDefaultProps } from "../types";
import PubSub from "../helpers/pubsub";

export default class Model extends PubSub {
  private props: tDefaultProps;

  constructor(props: tDefaultProps) {
    super();
    this.props = props;
  }

  getProps = (): tDefaultProps => {
    return this.props;
  };

  setProps = (props: tDefaultProps): void => {
    this.props = props;
  };
}
