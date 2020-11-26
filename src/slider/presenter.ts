import $ from "jquery";
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
import {
  IHandlePresenter,
  IHandleProps,
  IHandleView,
} from "../handle/interface";

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

  private handlePresenter: IHandlePresenter;

  private active: boolean = false;

  public currentHandleView: IHandleView | undefined;

  constructor(props: ISliderProps) {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel = new SliderModel(this.preparePropsForSliderModel(_props));
    this.trackPresenter = new TrackPresenter(this.preparePropsForTrackModel());
    this.handlePresenter = new HandlePresenter(
      this.preparePropsForHandleModel()
    );
    this.sliderView = new SliderView(
      this.sliderModel,
      this.trackPresenter,
      this.handlePresenter
    );
    $(this.initHandlers.bind(this));
  }

  public get$SliderView(): JQuery<HTMLElement> {
    return this.sliderView.get$SliderView();
  }

  public initHandlers(): void {
    $(this.sliderView.get$SliderView()).on({
      mouseover: this.onMouseover.bind(this),
      mouseout: this.onMouseout,
      mousemove: this.onMousemove,
      click: this.onClick,
      mousedown: this.onMouseDown,
      mouseup: this.onMouseUp,
    });
  }

  public onMouseUp = (e: any) => {
    // TODO
    // const { target } = e;
    console.log("onKeyUp : ", e.type); //TODO
    if (this.currentHandleView) {
      this.currentHandleView = undefined;
    }
  };

  public onMouseDown = (e: any) => {
    //TODO interface
    // const { target } = e;
    console.log("onKeyDown : ", e.type); //TODO
    const $handle = this.handlePresenter.get$View();
    if ($(e.target).closest($handle).length) {
      this.currentHandleView = this.handlePresenter.getView();
    }
  };

  public onClick = (e: any) => {
    //TODO interface
    // const { target } = e;
    console.log("onClick : ", e.type); //TODO
  };

  public onMousemove = (e: any): void => {
    if (!this.active || !this.currentHandleView) {
      return;
    }
    console.log("onMousemove : ", e); //TODO;
  };

  public onMouseover(e: any): void {
    //TODO interface
    if (this.active) {
      return;
    }
    const { target, relatedTarget } = e;
    const $sliderView = this.sliderView.get$SliderView();
    if (
      !$(relatedTarget).closest($sliderView).length &&
      $(target).closest($sliderView).length
    ) {
      this.active = true;
      //console.log("onMouseover : "); TODO
    }
  }

  public onMouseout = (e: any): void => {
    //TODO interface
    if (!this.active) {
      return;
    }
    const { target, relatedTarget } = e;
    const $sliderView = this.sliderView.get$SliderView();
    if (
      !$(relatedTarget).closest($sliderView).length &&
      $(target).closest($sliderView).length
    ) {
      //console.log("onMouseout : "); TODO
      this.active = false;
    }
  };

  public calcOffset(value: number): number {
    const { min, max } = this.sliderModel.getProps();
    const ratio = (value - min) / (max - min);
    return Math.max(0, ratio * 100);
  }

  public preparePropsForSliderModel(
    props: ISliderDefaultProps
  ): ISliderModelProps {
    const defaultValue =
      props.defaultValue !== undefined ? props.defaultValue : props.min;
    const value = props.value !== undefined ? props.value : defaultValue;
    return { ...props, value, defaultValue };
  }

  public preparePropsForTrackModel(): ITrackProps {
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

  public preparePropsForHandleModel(): IHandleProps {
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

  public html() {
    return this.sliderView.html();
  }
}
