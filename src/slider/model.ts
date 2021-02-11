import get from "lodash/get";

import PubSub from "../helpers/pubsub";
import { prepareData } from "../helpers/utils";
import { IModel } from "../slider/interface";
import { DefaultProps, Props } from "../types";

export default class Model extends PubSub implements IModel {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.onHandles();
  }

  getProps = (): DefaultProps => {
    return this.props;
  };

  setProps = (props: Props): void => {
    this.props = prepareData(props, this.getProps());
    this.publish("setPropsView", this.props);
  };

  private onHandles = (): void => {
    this.subscribe("setPropsModel", this.setPropsForView);
    this.subscribe("handleViewMouseDown", this.handleModelBeforeChange);
    this.subscribe("handleWindowMouseUp", this.handleModelAfterChange);
  };

  private handleModelBeforeChange = (values?: number[]): void => {
    const onBeforeChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onBeforeChange"]
    );
    values && onBeforeChange && onBeforeChange(values);
  };

  private handleModelChange = (values?: number[]): void => {
    const onChange: ((values: number[]) => void) | undefined = get(this.props, [
      "onChange",
    ]);
    values && onChange && onChange(values);
  };

  private handleModelAfterChange = (values?: number[]): void => {
    const onAfterChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onAfterChange"]
    );
    values && onAfterChange && onAfterChange(values);
  };

  private setPropsForView = (props: Props): void => {
    this.handleModelChange(get(props, ["values"]));
    this.setProps(props);
  };
}
