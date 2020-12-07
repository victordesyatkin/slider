import { tDefaultProps } from "../types";
import PubSub from "../helpers/pubsub";

export default class Model extends PubSub {
  private props: tDefaultProps;

  constructor(props: tDefaultProps) {
    super();
    this.props = props;
    this.onHandle();
  }

  private onHandle = (): void => {
    this.subscribe("setProps", this.setProps);
  };

  public getProps = (): tDefaultProps => {
    return this.props;
  };

  public setProps = (props: tDefaultProps): void => {
    this.props = props;
    this.publish("setProps", props);
  };
}
