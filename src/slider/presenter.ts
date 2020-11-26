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

  public parent: JQuery<HTMLElement> | undefined;

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
    const $slider = this.sliderView.get$SliderView();
    $($slider).on({
      click: this.onClick,
    });
    $(window).on({
      mousedown: this.onMouseDown,
      mouseup: this.onMouseUp,
      mousemove: this.onMousemove,
    });
  }

  getMousePosition(vertical: boolean, e: any) {
    // TODO
    return vertical ? e.clientY : e.pageX;
  }

  public clearCurrentHandle = () => {
    // console.log("clearCurrentHandleView : "); // TODO
    if (this.currentHandleView) {
      this.currentHandleView = undefined;
    }
  };

  public onClick = (e: any) => {
    // TODO interface
    // const { target } = e;
    console.log("onClick : ", e.type); // TODO
  };

  public updateModel = (props: ISliderModelProps): void => {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel.setProps(_props);
    //this.trackPresenter.updateModel(_props);
    this.handlePresenter.updateModel(this.preparePropsForHandleModel());
  };

  public onMousemove = (e: any): void => {
    if (!this.currentHandleView) {
      return;
    }
    // console.log("active : ", );
    // console.log("currentHandleView : ",);
    // console.log("onMousemove : ", e); // TODO;
    const props = this.sliderModel.getProps();
    const { vertical, value: prevValue } = props;
    const position = this.getMousePosition(vertical, e);
    const nextValue = this.calcValueByPos(position);
    if (prevValue !== nextValue) {
      //console.log("newValue : ", nextValue); // TODO
      this.updateModel({ ...props, value: nextValue });
    }
  };

  public onMouseUp = (e: any) => {
    // TODO
    // const { target } = e;
    // console.log("onKeyUp : ", e.type); //TODO
    this.clearCurrentHandle();
  };

  public onMouseDown = (e: any) => {
    // TODO interface
    // const { target } = e;
    // console.log("onMouseDown : ", e.type); //TODO
    const $handle = this.handlePresenter.get$View();
    if ($(e.target).closest($handle).length) {
      //console.log("onMouseDown : ", e); //TODO
      this.currentHandleView = this.handlePresenter.getView();
    }
  };

  getHandleCenterPosition(vertical: boolean, handle: HTMLElement) {
    const coords = handle.getBoundingClientRect();
    return vertical
      ? coords.top + coords.height * 0.5
      : window.pageXOffset + coords.left + coords.width * 0.5;
  }

  getSliderStart(): number {
    const slider = this.sliderView.get$SliderView().get(0);
    const { vertical, reverse } = this.sliderModel.getProps();
    const rect = slider.getBoundingClientRect();
    if (vertical) {
      return reverse ? rect.bottom : rect.top;
    }
    return window.pageXOffset + (reverse ? rect.right : rect.left);
  }

  getSliderLength() {
    const slider = this.sliderView.get$SliderView().get(0);
    if (!slider) {
      //TODO?
      return 0;
    }
    const { vertical } = this.sliderModel.getProps();
    const coords = slider.getBoundingClientRect();
    return vertical ? coords.height : coords.width;
  }

  calcValue(offset: number) {
    const { vertical, min, max } = this.sliderModel.getProps();
    const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
    const value = vertical
      ? (1 - ratio) * (max - min) + min
      : ratio * (max - min) + min;
    return value;
  }

  calcValueByPos(position: number) {
    const { reverse, min, max } = this.sliderModel.getProps();
    const sign = reverse ? -1 : +1;
    const pixelOffset = sign * (position - this.getSliderStart());
    const value = this.ensureValueInRange(this.calcValue(pixelOffset), {
      min,
      max,
    });
    return value;
  }

  public calcOffset(value: number): number {
    const { min, max } = this.sliderModel.getProps();
    const ratio = (value - min) / (max - min);
    return Math.max(0, ratio * 100);
  }

  ensureValueInRange(val: number, { max, min }: { max: number; min: number }) {
    if (val <= min) {
      return min;
    }
    if (val >= max) {
      return max;
    }
    return val;
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

  public render(parent: JQuery<HTMLElement>): void {
    this.parent = parent;
    $(parent).append(this.sliderView.get$SliderView());
  }
}
