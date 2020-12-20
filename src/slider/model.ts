import { DefaultProps, Props } from "../types";
import { prepareData } from "../helpers/utils";
import { IModel } from "../slider/interface";
import PubSub from "../helpers/pubsub";
import get from "lodash/get";

export default class Model extends PubSub implements IModel {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.onHandler();
  }

  onHandler = (): void => {
    this.subscribe("setPropsModel", this.setPropsForView);
    this.subscribe("onMouseDown", this.onBeforeChange);
    this.subscribe("onMouseUp", this.onAfterChange);
  };

  onBeforeChange = (values?: number[]): void => {
    const onBeforeChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onBeforeChange"]
    );
    values && onBeforeChange && onBeforeChange(values);
  };

  onChange = (values?: number[]): void => {
    const onChange: ((values: number[]) => void) | undefined = get(this.props, [
      "onChange",
    ]);
    values && onChange && onChange(values);
  };

  onAfterChange = (values?: number[]): void => {
    const onAfterChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onAfterChange"]
    );
    values && onAfterChange && onAfterChange(values);
  };

  setPropsForView = (props: Props): void => {
    this.onChange(get(props, ["values"]));
    this.setProps(props);
  };

  getProps = (): DefaultProps => {
    return this.props;
  };

  setProps = (props: Props): void => {
    this.props = prepareData(props, this.getProps());
    this.publish("setPropsView", this.props);
  };
}
