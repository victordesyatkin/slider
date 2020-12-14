import { DefaultProps, Props } from "../types";
import { prepareData } from "../helpers/utils";
import PubSub from "../helpers/pubsub";
import get from "lodash/get";

export default class Model extends PubSub {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.onHandler();
  }

  private onHandler = (): void => {
    this.subscribe("setPropsModel", this.setPropsForView);
    this.subscribe("onMouseDown", this.onBeforeChange);
    this.subscribe("onMouseUp", this.onAfterChange);
  };

  private onBeforeChange = (values?: number[]): void => {
    const onBeforeChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onBeforeChange"]
    );
    values && onBeforeChange && onBeforeChange(values);
  };

  private onChange = (values?: number[]): void => {
    const onChange: ((values: number[]) => void) | undefined = get(this.props, [
      "onChange",
    ]);
    values && onChange && onChange(values);
  };

  private onAfterChange = (values?: number[]): void => {
    const onAfterChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onAfterChange"]
    );
    values && onAfterChange && onAfterChange(values);
  };

  private setPropsForView = (props: Props): void => {
    this.onChange(get(props, ["values"]));
    this.setProps(props);
  };

  public getProps = (): DefaultProps => {
    return this.props;
  };

  public setProps = (props: Props): void => {
    this.props = prepareData(props, this.getProps());
    this.publish("setPropsView", this.props);
  };
}
