import noop from "lodash/noop";
import {
  ISliderProps,
  ISliderModel,
  ISliderView,
  ISliderPresenter,
  ISliderModelProps,
  ISliderDefaultProps,
} from "./interface";
import SliderModel from "./model";
import SliderView from "./view";
import TrackPresenter from "../track/presenter";
import { ITrackProps, ITrackPresenter } from "../track/interface";
import HandlePresenter from "../handle/presenter";
import { IHandleProps } from "../handle/interface";

export default class SliderPresenter implements ISliderPresenter {
  static defaultProps = {
    prefixCls: "slider",
    className: "",
    min: 0,
    max: 100,
    step: 1,
    marks: {},
    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    included: true,
    disabled: false,
    dots: false,
    vertical: false,
    reverse: false,
    trackStyle: {},
    handleStyle: {},
    railStyle: {},
    dotStyle: {},
    activeDotStyle: {},
  };

  private sliderModel: ISliderModel;

  private sliderView: ISliderView;

  private trackPresenter: ITrackPresenter;

  private handlePresenter; //TODO

  constructor(props: ISliderProps) {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel = new SliderModel(this.preparePropsForSliderModel(_props));
    this.trackPresenter = new TrackPresenter(this.preparePropsForTrackModel());
    this.handlePresenter = new HandlePresenter(
      this.preparePropsForHandleModel()
    );
    this.sliderView = new SliderView(this.sliderModel, this.trackPresenter);
  }

  calcOffset(value: number): number {
    const { min, max } = this.sliderModel.getProps();
    const ratio = (value - min) / (max - min);
    return Math.max(0, ratio * 100);
  }

  preparePropsForSliderModel(props: ISliderDefaultProps): ISliderModelProps {
    const defaultValue =
      props.defaultValue !== undefined ? props.defaultValue : props.min;
    const value = props.value !== undefined ? props.value : defaultValue;
    return { ...props, value, defaultValue };
  }

  preparePropsForTrackModel(): ITrackProps {
    const props = this.sliderModel.getProps();
    const {
      prefixCls,
      reverse,
      vertical,
      startPoint,
      included,
      value,
      trackStyle,
    } = props;
    const trackOffset =
      startPoint !== undefined ? this.calcOffset(startPoint) : 0;
    const offset = this.calcOffset(value);
    return {
      className: `${prefixCls}__track`,
      vertical,
      included,
      reverse,
      offset: trackOffset,
      length: offset - trackOffset,
      style: trackStyle,
    };
  }

  preparePropsForHandleModel(): IHandleProps {
    const props = this.sliderModel.getProps();
    const {
      prefixCls,
      vertical,
      value,
      disabled,
      min,
      max,
      reverse,
      tabIndex,
      handleStyle,
    } = props;

    return {
      className: `${prefixCls}__handle`,
      prefixCls,
      vertical,
      offset: this.calcOffset(value),
      value,
      disabled,
      min,
      max,
      reverse,
      index: 0,
      tabIndex: tabIndex || 0,
      style: handleStyle,
    };
  }

  render() {
    return this.sliderView.render();
  }
}
