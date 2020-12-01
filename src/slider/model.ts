import { ISliderModelProps } from "./interface";
import { ITrackPresenter } from "../track/interface";
import { IHandlePresenter } from "../handle/interface";
import { IDotsPresenter } from "../dots/interface";
import { IMarksPresenter } from "../marks/interface";

export default class SliderModel {
  private props: ISliderModelProps;

  constructor(tprops: ISliderModelProps) {
    this.props = tprops;
  }

  getProps(): ISliderModelProps {
    return this.props;
  }

  setProps(tprops: ISliderModelProps): void {
    this.props = tprops;
  }

  getSliderClassName(): string {
    return this.props.sliderClassName;
  }

  getChildren():
    | (ITrackPresenter | IHandlePresenter | IDotsPresenter | IMarksPresenter)[]
    | undefined {
    return this.props.children;
  }
}
