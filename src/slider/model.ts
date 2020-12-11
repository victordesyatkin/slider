import { DefaultProps } from "../types";
import merge from "lodash/merge";
import PubSub from "../helpers/pubsub";

export default class Model extends PubSub {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.onHandle();
  }

  private onHandle = (): void => {
    this.subscribe("setPropsModel", this.setProps);
  };

  public getProps = (): DefaultProps => {
    return this.props;
  };

  public setProps = (props: DefaultProps): void => {
    this.props = merge({ ...this.props }, props);
    this.publish("setPropsView", props);
  };
}
