import { IPubSub } from "../helpers/interface";
import { tDefaultProps } from "../types";

export default class Presenter {
  private model: any;
  private view: any;
  private pubsub: IPubSub;

  constructor(model: any, view: any, pubsub: IPubSub) {
    this.model = model;
    this.view = view;
    this.pubsub = pubsub;
  }
}
