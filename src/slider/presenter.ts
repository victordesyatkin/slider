import noop from "lodash/noop";
import {
  ISliderProps,
  ISliderModel,
  ISliderView,
  ISliderPresenter,
  ISliderModelProps,
} from "./interface";
import SliderModel from "./model";
import SliderView from "./view";
import TrackPresenter from '../track/presenter';
import { ITrackPresenter, ITrackProps } from "../track/interface";
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
    trackStyle: [{}],
    handleStyle: [{}],
    railStyle: {},
    dotStyle: {},
    activeDotStyle: {},
  };

  private sliderModel: ISliderModel;

  private sliderView: ISliderView;

  constructor(props: ISliderProps) {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel = new SliderModel(this.preparePropsForSliderModel(_props));
    this.sliderView = new SliderView(this.sliderModel);
  }

  preparePropsForSliderModel(props: ISliderModelProps): ISliderModelProps {
    const defaultValue =
      props.defaultValue !== undefined ? props.defaultValue : props.min;
    const value = props.value !== undefined ? props.value : defaultValue;
    return { ...props, value, defaultValue };
  }

  preparePropsForTrackPresenter():ITrackProps {
    const _props = { ...SliderPresenter.defaultProps, ...this.sliderModel.getProps() };;
    const {
        prefixCls,
        offset,
        reverse,
        vertical,
        length,
        style;
        included,
    } = props;
    return {
        className: `${prefixCls}__track`,
        vertical,
        included,
        offset,
    };
  };

  render() {
    return this.sliderView.render(
      new TrackPresenter(this.preparePropsForSliderModel())
    );
  }
}
