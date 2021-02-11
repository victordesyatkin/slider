import get from "lodash/get";
import bind from "bind-decorator";

import PubSub from "../helpers/pubsub";
import { prepareData } from "../helpers/utils";
import { IModel } from "../slider/interface";
import { DefaultProps, Props } from "../types";

class Model extends PubSub implements IModel {
  private props: DefaultProps;

  constructor(props: DefaultProps) {
    super();
    this.props = props;
    this.initHandles();
  }

  public getProps(): DefaultProps {
    return this.props;
  }

  public setProps(props: Props): void {
    this.props = prepareData(props, this.getProps());
    this.publish("setPropsView", this.props);
  }

  private initHandles(): void {
    this.subscribe("setPropsModel", this.setPropsForView);
    this.subscribe("handleViewMouseDown", this.handleModelBeforeChange);
    this.subscribe("handleWindowMouseUp", this.handleModelAfterChange);
  }

  private handleModelChange(values?: number[]): void {
    const handleModelChange: ((values: number[]) => void) | undefined = get(
      this.props,
      ["onChange"]
    );
    values && handleModelChange && handleModelChange(values);
  }

  @bind
  private handleModelBeforeChange(values?: number[]): void {
    const handleModelBeforeChange:
      | ((values: number[]) => void)
      | undefined = get(this.props, ["onBeforeChange"]);
    values && handleModelBeforeChange && handleModelBeforeChange(values);
  }

  @bind
  private handleModelAfterChange(values?: number[]): void {
    const handleModelAfterChange:
      | ((values: number[]) => void)
      | undefined = get(this.props, ["onAfterChange"]);
    values && handleModelAfterChange && handleModelAfterChange(values);
  }

  @bind
  private setPropsForView(props: Props): void {
    this.handleModelChange(get(props, ["values"]));
    this.setProps(props);
  }
}

export default Model;
