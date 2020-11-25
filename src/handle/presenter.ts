import HandleModel from "./model";
import HandleView from "./view";
import {
  IHandleModel,
  IHandleProps,
  IHandleView,
  IHandlePropsModel,
} from "./interface";

export default class HandlePresenter {
  private model: IHandleModel;
  private view: IHandleView;

  constructor(props: IHandleProps) {
    this.model = new HandleModel(_props);
    this.view = new HandleView(this.model);
  }

  getModel() {
    return this.model;
  }

  setModel(model: IHandleModel) {
    return (this.model = model);
  }

  render(): string {
    return this.view.render();
  }
}
