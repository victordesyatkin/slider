declare module "*.scss";
import { tProps } from "./types";
interface JQuery {
  slider: (props: tProps) => JQuery;
}
