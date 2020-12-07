import { tDefaultProps } from "../types";

export default class View {
  private parent?: JQuery<HTMLElement>;
  private props?: tDefaultProps;

  constructor(parent: JQuery<HTMLElement>) {
    this.parent = parent;
  }
}
