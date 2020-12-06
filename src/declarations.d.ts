import { tProps } from "./types";
declare global {
  interface JQuery {
    slider(props: tProps): JQuery;
  }
}

declare module "*.scss";
