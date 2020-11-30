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
import { ITrackProps, ITrackPresenter } from "../track/interface";
import TrackPresenter from "../track/presenter";
import {
  IHandlePresenter,
  IHandleProps,
  IHandleView,
} from "../handle/interface";
import HandlePresenter from "../handle/presenter";
import { IDotsPresenter, IDotsProps } from "../dots/interface";
import DotsPresenter from "../dots/presenter";
import { IMarksPresenter, IMarksProps } from "../marks/interface";
import MarksPresenter from "../marks/presenter";
import { calcOffset } from "../utils";

export default class SliderPresenter implements ISliderPresenter {
  static defaultProps = {
    prefixCls: "slider",
    className: "",
    min: 0,
    max: 100,
    //step: 1,
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
    allowCross: false,
    precision: 0,
  };

  private sliderModel: ISliderModel;

  private sliderView: ISliderView;

  private trackPresenters: ITrackPresenter[];

  private handlePresenters: IHandlePresenter[];

  private dotsPresenter: IDotsPresenter;

  private offsets: number[] = [];

  private currentHandleView: IHandleView | undefined;

  private marksPresenter: IMarksPresenter;

  private parent: JQuery<HTMLElement> | undefined;

  constructor(props: ISliderProps) {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel = new SliderModel(this.preparePropsForSliderModel(_props));
    this.marksPresenter = this.createMarksPresenter();
    this.dotsPresenter = this.createDotsPresenter();
    this.handlePresenters = this.factoryHandlePresenters();
    this.trackPresenters = this.factoryTrackPresenters();
    const propsModel = this.sliderModel.getProps();
    this.sliderModel.setProps({
      ...propsModel,
      children: [
        this.marksPresenter,
        this.dotsPresenter,
        ...this.handlePresenters,
        ...this.trackPresenters,
      ],
    });
    const { disabled } = propsModel;
    !disabled && $(this.initHandlers.bind(this));
    this.sliderView = new SliderView(this.sliderModel);
  }

  createMarksPresenter = (): MarksPresenter => {
    const props = this.sliderModel.getProps();
    return new MarksPresenter(this.preparePropsForMarksModel(props));
  };

  preparePropsForMarksModel = (props: ISliderModelProps): IMarksProps => {
    const { marks, min, max, step, prefixCls } = props;
    return {
      ...marks,
      min,
      max,
      step,
      prefixCls,
      onClick: this.onClickWithValue,
    };
  };

  createDotsPresenter = (): DotsPresenter => {
    return new DotsPresenter(
      this.preparePropsForDotsModel(this.sliderModel.getProps())
    );
  };

  preparePropsForDotsModel = (_props: ISliderModelProps): IDotsProps => {
    return {
      prefixCls: _props.prefixCls,
      dots: _props.dots,
      dotStyle: _props.dotStyle,
      activeDotStyle: _props.activeDotStyle,
      min: _props.min,
      max: _props.max,
      vertical: _props.vertical,
      reverse: _props.reverse,
      step: _props.step,
      marks: _props.marks,
    };
  };

  factoryTrackPresenters = (): ITrackPresenter[] => {
    const props = this.sliderModel.getProps();
    const { value, trackStyle, defaultValue, handleStyle, tabIndex } = props;
    let _value = value;
    if (value.length > 1) {
      _value = value.slice(0, -1);
    }
    return _value.map((v, i) => {
      return new TrackPresenter(
        this.preparePropsForTrackModel({
          ...props,
          value: v,
          defaultValue: defaultValue[i],
          trackStyle: trackStyle[i],
          handleStyle: handleStyle[i],
          index: i,
          tabIndex: tabIndex ? tabIndex[i] : 0,
        })
      );
    });
  };

  factoryHandlePresenters = (): IHandlePresenter[] => {
    const props = this.sliderModel.getProps();
    const { value, defaultValue, handleStyle, trackStyle, tabIndex } = props;
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
            tabIndex: tabIndex ? tabIndex[i] : 0,
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
    this.sliderHandlersOn($slider);
  }

  private sliderHandlersOn($slider: JQuery<HTMLElement>): void {
    $slider.on({
      click: this.onClick,
    });
    $(window).on({
      mousedown: this.onMouseDown,
      mouseup: this.onMouseUp,
      mousemove: this.onMousemove,
    });
  }

  private sliderHandlersOff($slider: JQuery<HTMLElement>): void {
    $slider.off({
      click: this.onClick,
    });
    $(window).off({
      mousedown: this.onMouseDown,
      mouseup: this.onMouseUp,
      mousemove: this.onMousemove,
    });
  }

  getPrecision(step: number): number {
    const stepString = step.toString();
    let precision = 0;
    if (stepString.indexOf(".") >= 0) {
      precision = stepString.length - stepString.indexOf(".") - 1;
    }
    return precision;
  }

  getClosestPoint(
    val: number,
    { step, min, max }: { step: number | undefined; min: number; max: number }
  ): number {
    let points; //TODO
    if (this.marksPresenter) {
      points = this.marksPresenter.getAdditionValues();
    }
    if (!points) {
      points = new Array();
    }
    if (step !== undefined) {
      const baseNum = 10 ** this.getPrecision(step);
      const maxSteps = Math.floor(
        (max * baseNum - min * baseNum) / (step * baseNum)
      );
      const steps = Math.min((val - min) / step, maxSteps);
      const closestStep = Math.round(steps) * step + min;
      points.push(closestStep);
    }
    const diffs = points.map((point) => Math.abs(val - point));
    return points[diffs.indexOf(Math.min(...diffs))];
  }

  ensureValuePrecision(v: number): number {
    const props = this.sliderModel.getProps();
    const { step, min, max } = props;
    if (!step) {
      return v;
    }
    const closestPoint = isFinite(this.getClosestPoint(v, { step, min, max }))
      ? this.getClosestPoint(v, { step, min, max })
      : 0;
    // TODO
    // return !step
    //   ? closestPoint
    //   : parseFloat(closestPoint.toFixed(this.getPrecision(step)));
    return parseFloat(closestPoint.toFixed(this.getPrecision(step)));
  }

  getMousePosition(vertical: boolean, e: any) {
    // TODO e interface
    return vertical ? e.clientY : e.pageX;
  }

  public clearCurrentHandle = () => {
    this.currentHandleView = undefined;
    console.log("clearCurrentHandleView : ", !!this.currentHandleView); // TODO
  };

  private onClickWithValue = (event: any, nextValue: number): boolean => {
    event.preventDefault();
    event.stopPropagation();
    const props = this.sliderModel.getProps();
    const { value, onAfterChange } = props;
    if (value.length === 1) {
      this.currentHandleView = this.handlePresenters[0].getView();
      const handlePresenterProps = this.currentHandleView.getModel().getProps();
      const { value: prevValue, index } = handlePresenterProps;
      if (nextValue !== prevValue) {
        const _props = { ...props };
        _props.value[index] = nextValue;
        this.onBeforeChange();
        this.updateModel(_props);
        this.onAfterChange();
      }
      this.clearCurrentHandle();
    }
    return false;
  };

  private onClick = (e: any): void => {
    // TODO e interface
    // const { target } = e;
    // console.log("onClick : ", e.target); // TODO
    // e.preventDefault();
    // e.stopPropagation();
    const { value, vertical } = this.sliderModel.getProps();
    if (value.length === 1) {
      console.log(
        "this.handlePresenters[0].get$View() : ",
        this.handlePresenters[0].get$View()
      );
      console.log(
        !$(e.target).closest(this.handlePresenters[0].get$View()).length
      );
      if (!$(e.target).closest(this.handlePresenters[0].get$View()).length) {
        this.currentHandleView = this.handlePresenters[0].getView();
        const {
          value: prevValue,
        } = this.currentHandleView.getModel().getProps();
        const position = this.getMousePosition(vertical, e);
        const nextValue = this.calcValueByPos(position);
        if (nextValue !== prevValue) {
          this.onBeforeChange();
          this.onChange(e);
          this.onAfterChange();
          this.clearCurrentHandle();
        }
      }
    }
  };

  private updateModel = (props: ISliderModelProps): void => {
    const _props = { ...SliderPresenter.defaultProps, ...props };
    this.sliderModel.setProps(_props);
    this.updateMarks(_props);
    this.updateHandles(_props);
    this.updateTraks(_props);
    this.updateDots(_props);

    const propsModel = this.sliderModel.getProps();
    const { disabled } = propsModel;
    const $slider = this.sliderView.get$SliderView();
    this.sliderHandlersOff($slider);
    if (!disabled) {
      this.sliderHandlersOn($slider);
    }
    propsModel.children = [
      this.marksPresenter,
      ...this.handlePresenters,
      ...this.trackPresenters,
      this.dotsPresenter,
    ];
    this.sliderModel.setProps(propsModel);
    this.sliderView.updateSliderView();
  };

  private moveHandle(_props: ISliderModelProps): void {
    if (this.currentHandleView !== undefined) {
      const { index } = this.currentHandleView.getModel().getProps();
      const currentProps = {
        value: _props.value[index],
        defaultValue: _props.defaultValue[index],
        index,
        handleStyle: _props.handleStyle[index],
        trackStyle: _props.trackStyle[index],
        tabIndex: _props.tabIndex ? _props.tabIndex[index] : 0,
      };
      this.handlePresenters[index].updateModel(
        this.preparePropsForHandleModel({
          ..._props,
          ...currentProps,
        })
      );
      for (let i = index - 1; i < index + 1; i += 1) {
        this.trackPresenters[i] &&
          this.trackPresenters[i].updateModel(
            this.preparePropsForTrackModel({
              ..._props,
              value: _props.value[i],
              defaultValue: _props.defaultValue[i],
              index: i,
              handleStyle: _props.handleStyle[i],
              trackStyle: _props.trackStyle[i],
              tabIndex: _props.tabIndex ? _props.tabIndex[i] : 0,
            })
          );
      }
    }
  }

  private updateTraks(props: ISliderModelProps): void {
    const { value, trackStyle, defaultValue, handleStyle, tabIndex } = props;
    let _value = value;
    if (value.length > 1) {
      _value = value.slice(0, -1);
    }
    _value.forEach((v, i) => {
      const model = this.preparePropsForTrackModel({
        ...props,
        value: v,
        defaultValue: defaultValue[i],
        trackStyle: trackStyle[i],
        handleStyle: handleStyle[i],
        index: i,
        tabIndex: tabIndex ? tabIndex[i] : -1,
      });
      if (this.trackPresenters[i]) {
        this.trackPresenters[i].updateModel(model);
      } else {
        this.trackPresenters[i] = new TrackPresenter(model);
      }
    });
    if (this.trackPresenters.length > value.length) {
      for (const trackPresenter of this.trackPresenters.splice(value.length)) {
        trackPresenter.destroy();
      }
    }
  }

  private updateHandles(props: ISliderModelProps): void {
    const { value, defaultValue, handleStyle, trackStyle, tabIndex } = props;
    value.forEach((v, i): void => {
      const _props = this.preparePropsForHandleModel({
        ...props,
        value: v,
        defaultValue: defaultValue[i],
        index: i,
        handleStyle: handleStyle[i],
        trackStyle: trackStyle[i],
        tabIndex: tabIndex ? tabIndex[i] : 0,
      });
      if (this.handlePresenters[i]) {
        this.handlePresenters[i].updateModel(_props);
      } else {
        this.handlePresenters[i] = new HandlePresenter(_props);
      }
    });
    if (this.handlePresenters.length > value.length) {
      for (const handlePresenter of this.handlePresenters.splice(
        value.length
      )) {
        handlePresenter.destroy();
      }
    }
  }

  private updateDots(props: ISliderModelProps): void {
    return this.dotsPresenter.updateModel(this.preparePropsForDotsModel(props));
  }

  private updateMarks(props: ISliderModelProps): void {
    return this.marksPresenter.updateModel(
      this.preparePropsForMarksModel(props)
    );
  }

  private onMousemove = (e: any): void => {
    // TODO e interface;
    // console.log("active : ", );
    // console.log("currentHandleView : ",);
    // console.log("onMousemove : ", e); // TODO;
    this.onChange(e);
  };

  private onChange(e: any): void {
    // TODO e interface;
    if (!this.currentHandleView) {
      return;
    }
    const modelProps = this.sliderModel.getProps();
    const { vertical, onChange } = modelProps;
    const handlePresenterProps = this.currentHandleView.getModel().getProps();
    const { value: prevValue, index } = handlePresenterProps;
    const position = this.getMousePosition(vertical, e);
    const nextValue = this.calcValueByPos(position);
    if (prevValue !== nextValue) {
      //console.log("newValue : ", nextValue); // TODO
      const _modelProps = {
        ...modelProps,
      };
      _modelProps.value[index] = nextValue;
      this.sliderModel.setProps(_modelProps);
      this.moveHandle(_modelProps);
      onChange(_modelProps.value);
    }
  }

  private onMouseUp = (e: any) => {
    // TODO
    // const { target } = e;
    //console.log("onMouseUp : ", e.type); //TODO
    if (this.currentHandleView) {
      this.clearCurrentHandle();
      console.log("onMouseUp : ", this.currentHandleView);
      this.onAfterChange();
    }
  };

  private onMouseDown = (e: any) => {
    // TODO e interface
    // const { target } = e;
    // console.log("onMouseDown : ", e.type); //TODO
    for (const handlePresenter of this.handlePresenters) {
      const $handle = handlePresenter.get$View();
      if ($(e.target).closest($handle).length) {
        // console.log("onMouseDown : ", e); // TODO
        // console.log("onMouseDown : ", handlePresenter.getModel()); // TODO
        this.currentHandleView = handlePresenter.getView();
        this.onBeforeChange();
      }
    }
  };

  private onBeforeChange(): void {
    const { onBeforeChange, value } = this.sliderModel.getProps();
    //console.log("onBeforeChange : ", value);
    onBeforeChange(value);
  }

  private onAfterChange(): void {
    const { onAfterChange, value } = this.sliderModel.getProps();
    //console.log("onBeforeChange : ", value);
    onAfterChange(value);
  }

  private getHandleCenterPosition(vertical: boolean, handle: HTMLElement) {
    const coords = handle.getBoundingClientRect();
    return vertical
      ? coords.top + coords.height * 0.5
      : window.pageXOffset + coords.left + coords.width * 0.5;
  }

  private getSliderStart(): number {
    const slider = this.sliderView.get$SliderView().get(0);
    const { vertical, reverse } = this.sliderModel.getProps();
    const rect = slider.getBoundingClientRect();
    if (vertical) {
      return reverse ? rect.bottom : rect.top;
    }
    return window.pageXOffset + (reverse ? rect.right : rect.left);
  }

  private getSliderLength() {
    const slider = this.sliderView.get$SliderView().get(0);
    if (!slider) {
      //TODO?
      return 0;
    }
    const { vertical } = this.sliderModel.getProps();
    const coords = slider.getBoundingClientRect();
    return vertical ? coords.height : coords.width;
  }

  private calcValue(offset: number) {
    const { vertical, min, max, precision } = this.sliderModel.getProps();
    const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
    const value = vertical
      ? (1 - ratio) * (max - min) + min
      : ratio * (max - min) + min;
    return Number(value.toFixed(precision));
  }

  private ensureValueCorrectNeighbors(value: number, index?: number): number {
    const {
      allowCross,
      value: valueModel,
      pushable,
      min,
      max,
    } = this.sliderModel.getProps();
    if (this.currentHandleView) {
      const _props = this.currentHandleView.getModel().getProps();
      const { index: i } = _props;
      index = i;
    }
    if (index !== undefined && !allowCross && valueModel.length > 1) {
      const prevHandle = this.handlePresenters[index - 1];
      const nextHandle = this.handlePresenters[index + 1];
      let prevValue;
      let nextValue;
      if (prevHandle) {
        prevValue = prevHandle.getModel().getProps().value;
        prevValue = pushable ? prevValue + pushable : prevValue;
      }
      if (nextHandle) {
        nextValue = nextHandle.getModel().getProps().value;
        nextValue = pushable ? nextValue - pushable : nextValue;
      }
      value = this.ensureValueInRange(value, {
        min: prevValue || min,
        max: nextValue || max,
      });
    }
    return value;
  }

  private calcValueWithEnsure(value: number, index?: number): number {
    value = this.ensureValuePrecision(value);
    value = this.ensureValueCorrectNeighbors(value, index);
    return value;
  }

  private calcValueByPos(position: number) {
    const { reverse, min, max } = this.sliderModel.getProps();
    const sign = reverse ? -1 : +1;
    const pixelOffset = sign * (position - this.getSliderStart());
    let value = this.ensureValueInRange(this.calcValue(pixelOffset), {
      min,
      max,
    });
    value = this.calcValueWithEnsure(value);
    return value;
  }

  private ensureValueInRange(
    val: number,
    { max, min }: { max: number; min: number }
  ) {
    if (val <= min) {
      return min;
    }
    if (val >= max) {
      return max;
    }
    return val;
  }

  private preparePropsForSliderModel(
    props: ISliderDefaultProps
  ): ISliderModelProps {
    const { prefixCls, marks = {}, disabled, vertical, className } = props;
    const sliderClassName = classnames(prefixCls, {
      [`${prefixCls}_with-marks`]: Object.keys(marks).length,
      [`${prefixCls}_disabled`]: disabled,
      [`${prefixCls}_vertical`]: vertical,
      [className]: className,
    });
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
    return {
      ...props,
      value,
      defaultValue,
      count,
      sliderClassName,
    };
  }

  private preparePropsForTrackModel(props: ISliderSingleProps): ITrackProps {
    const {
      prefixCls,
      reverse,
      vertical,
      startPoint,
      included,
      trackStyle,
      index,
      count,
      min,
      max,
    } = props;
    let length;
    let offset;
    if (count > 1) {
      offset = this.offsets[index];
      length = this.offsets[index + 1] - this.offsets[index];
    } else {
      const trackOffset =
        startPoint !== undefined ? calcOffset(startPoint, min, max) : 0;
      offset = trackOffset;
      length = this.offsets[index] - trackOffset;
    }
    return {
      className: classnames(`${prefixCls}__track`, {
        [`${prefixCls}__track-${index}`]: true,
      }),
      vertical,
      included,
      reverse,
      offset,
      length,
      style: trackStyle,
    };
  }

  private preparePropsForHandleModel(props: ISliderSingleProps): IHandleProps {
    const {
      prefixCls,
      vertical,
      disabled,
      min,
      max,
      reverse,
      tabIndex,
      handleStyle,
      index,
      tooltip,
      step,
    } = props;
    let { value } = props;
    if (step) {
      value = this.calcValueWithEnsure(value, index);
    }
    this.offsets[index] = calcOffset(value, min, max);
    return {
      prefixCls,
      vertical,
      value,
      disabled,
      min,
      max,
      reverse,
      index,
      tabIndex: tabIndex || -1,
      className: `${prefixCls}__handle`,
      offset: this.offsets[index],
      style: handleStyle,
      tooltip,
    };
  }

  public html() {
    return this.sliderView.html();
  }

  public render(parent: JQuery<HTMLElement>): void {
    this.parent = parent;
    $(parent).append(this.sliderView.get$SliderView());
  }

  public update(props: ISliderProps | undefined): void {
    if (!props) {
      return undefined;
    }
    const _props = this.sliderModel.getProps();
    this.updateModel(this.preparePropsForSliderModel({ ..._props, ...props }));
  }
}
