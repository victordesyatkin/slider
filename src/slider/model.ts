import { DefaultProps, Props } from "../types";
import { prepareData } from "../helpers/utils";
import PubSub from "../helpers/pubsub";

export default class Model extends PubSub {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.onHandler();
  }

  private onHandler = (): void => {
    this.subscribe("setPropsModel", this.setProps);
  };

  public getProps = (): DefaultProps => {
    return this.props;
  };

  public setProps = (props: Props): void => {
    this.props = prepareData(props, this.getProps());
    this.publish("setPropsView", this.props);
  };
}
