import $ from "jquery";
import noop from "lodash/noop";
import classnames from "classnames";
import {
  ISliderProps,
  ISliderModel,
  ISliderView,
  ISliderPresenter,
  ISliderModelProps,
  ISliderDefaultProps,
  ISliderSingleProps,
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
    trackStyle: [],
    handleStyle: [],
    railStyle: {},
    dotStyle: {},
    activeDotStyle: {},
  };

  private sliderModel: ISliderModel;

  private sliderView: ISliderView;

  private trackPresenters: ITrackPresenter[];

  private handlePresenters: IHandlePresenter[];

  private offsets: number[] = [];

  public parent: JQuery<HTMLElement> | undefined;

  public currentHandleView: IHandleView | undefined;

  constructor(props: ISliderProps) {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel = new SliderModel(this.preparePropsForSliderModel(_props));
    this.handlePresenters = this.factoryHandlePresenters();
    this.trackPresenters = this.factoryTrackPresenters();
    this.sliderView = new SliderView(
      this.sliderModel,
      this.trackPresenters,
      this.handlePresenters
    );
    $(this.initHandlers.bind(this));
  }

  factoryTrackPresenters = (): ITrackPresenter[] => {
    const props = this.sliderModel.getProps();
    const { value, trackStyle, defaultValue, handleStyle } = props;
    return value.map((v, i) => {
      return new TrackPresenter(
        this.preparePropsForTrackModel({
          ...props,
          value: v,
          defaultValue: defaultValue[i],
          trackStyle: trackStyle[i],
          handleStyle: handleStyle[i],
          index: i,
        })
      );
    });
  };

  factoryHandlePresenters = (): IHandlePresenter[] => {
    const props = this.sliderModel.getProps();
    const { value, defaultValue, handleStyle, trackStyle } = props;
    return value.map(
      (v, i): IHandlePresenter => {
        return new HandlePresenter(
          this.preparePropsForHandleModel({
            ...props,
            value: v,
            defaultValue: defaultValue[i],
            index: i,
            handleStyle: handleStyle[i],
            trackStyle: trackStyle[i],
          })
        );
      }
    );
  };

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
    // TODO e interface
    return vertical ? e.clientY : e.pageX;
  }

  public clearCurrentHandle = () => {
    // console.log("clearCurrentHandleView : "); // TODO
    if (this.currentHandleView) {
      this.currentHandleView = undefined;
    }
  };

  public onClick = (e: any) => {
    // TODO e interface
    // const { target } = e;
    console.log("onClick : ", e.type); // TODO
  };

  public updateModel = (props: ISliderModelProps): void => {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel.setProps(_props);
    if (this.currentHandleView !== undefined) {
      const { index } = this.currentHandleView.getModel().getProps();
      const currentProps = {
        value: _props.value[index],
        defaultValue: _props.defaultValue[index],
        index,
        handleStyle: _props.handleStyle[index],
        trackStyle: _props.trackStyle[index],
      };
      this.handlePresenters[index].updateModel(
        this.preparePropsForHandleModel({
          ..._props,
          ...currentProps,
        })
      );
      this.trackPresenters[index].updateModel(
        this.preparePropsForTrackModel({
          ..._props,
          ...currentProps,
        })
      );
    }
  };

  public onMousemove = (e: any): void => {
    // TODO e interface;
    if (!this.currentHandleView) {
      return;
    }
    // console.log("active : ", );
    // console.log("currentHandleView : ",);
    // console.log("onMousemove : ", e); // TODO;
    const modelProps = this.sliderModel.getProps();
    const { vertical } = modelProps;
    const handlePresenterProps = this.currentHandleView.getModel().getProps();
    const { value: prevValue, index } = handlePresenterProps;

    const position = this.getMousePosition(vertical, e);
    const nextValue = this.calcValueByPos(position);
    if (prevValue !== nextValue) {
      //console.log("newValue : ", nextValue); // TODO
      modelProps.value[index] = nextValue;
      this.updateModel({ ...modelProps });
    }
  };

  public onMouseUp = (e: any) => {
    // TODO
    // const { target } = e;
    // console.log("onKeyUp : ", e.type); //TODO
    this.clearCurrentHandle();
  };

  public onMouseDown = (e: any) => {
    // TODO e interface
    // const { target } = e;
    // console.log("onMouseDown : ", e.type); //TODO
    for (const handlePresenter of this.handlePresenters) {
      const $handle = handlePresenter.get$View();
      if ($(e.target).closest($handle).length) {
        // console.log("onMouseDown : ", e); // TODO
        // console.log("onMouseDown : ", handlePresenter.getModel()); // TODO
        this.currentHandleView = handlePresenter.getView();
      }
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
    let { defaultValue, value, count } = props;
    if (defaultValue === undefined) {
      defaultValue = [];
    }
    if (value === undefined) {
      value = [];
    }
    const length = value.length || defaultValue.length || count || 1;
    for (let i = 0; i < length; i += 1) {
      if (defaultValue[i] !== undefined) {
        continue;
      }
      defaultValue[i] = props.min;
    }
    for (let i = 0; i < length; i += 1) {
      if (value[i] !== undefined) {
        continue;
      }
      value[i] = defaultValue[i];
    }
    if (count == undefined) {
      count = length;
    }
    return { ...props, value, defaultValue, count };
  }

  public preparePropsForTrackModel(props: ISliderSingleProps): ITrackProps {
    const {
      prefixCls,
      reverse,
      vertical,
      startPoint,
      included,
      trackStyle,
      index,
      count,
    } = props;
    let length;
    let offset;
    const classNames = [`${prefixCls}__track`, `${prefixCls}__track-${index}`];
    if (count > 1) {
      offset = this.offsets[index];
      length = this.offsets[index + 1] - this.offsets[index] || 0;
      // console.log("index : ", index);
      // console.log("count : ", count);
      console.log("this.offsets[index] : ", this.offsets[index]);
      console.log("this.offsets[index+1] : ", this.offsets[index + 1]);
      console.log("length : ", length);
    } else {
      const trackOffset =
        startPoint !== undefined ? this.calcOffset(startPoint) : 0;
      offset = this.offsets[index];
      length = offset - trackOffset;
    }
    return {
      className: classnames([classNames]),
      vertical,
      included,
      reverse,
      offset,
      length,
      style: trackStyle,
    };
  }

  public preparePropsForHandleModel(props: ISliderSingleProps): IHandleProps {
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
      index,
    } = props;
    this.offsets[index] = this.calcOffset(value);
    return {
      prefixCls,
      vertical,
      value,
      disabled,
      min,
      max,
      reverse,
      index,
      tabIndex: tabIndex || 0,
      className: `${prefixCls}__handle`,
      offset: this.offsets[index],
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
