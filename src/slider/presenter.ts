import { IPresenter, IModel } from "./interface";

export default class Presenter implements IPresenter {
  private model: IModel;

  constructor(model: IModel) {
    this.model = model;
  }

  private setModel = () => {};

  public onChange(values: number[]) {
    let props = this.model.getProps();
    props = { ...props, values };
    this.model.setProps(props);
    this.model.subscribe();
  }
}
