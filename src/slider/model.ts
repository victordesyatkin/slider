import { ISliderModelProps } from "./interface";
import { ITrackPresenter } from "../track/interface";
import { IHandlePresenter } from "../handle/interface";
import { IDotsPresenter } from "../dots/interface";
import { IMarksPresenter } from "../marks/interface";

export default class SliderModel {
  private props: ISliderModelProps;

  constructor(_props: ISliderModelProps) {
    this.props = _props;
  }

  getProps(): ISliderModelProps {
    return this.props;
  }

  setProps(_props: ISliderModelProps): void {
    this.props = _props;
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
