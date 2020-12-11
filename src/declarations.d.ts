import { Props } from "./types";
declare global {
  interface JQuery {
    slider(props: Props): JQuery;
  }
}

declare module "*.scss";
