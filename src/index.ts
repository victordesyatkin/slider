import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const slider = new SliderPresenter({
  prefixCls: "slider",
  //value: [0, 10, 40, 70],
  value: [10, 20],
  min: -20,
  //step: 30,
  dots: true,
  marks: {
    show: true,
    render: (v: number): string => {
      return `${v} $`;
    },
    values: [0],
    dots: true,
  },
  tooltip: {
    show: true,
    render: (v: number): string => {
      return `${v} $`;
    },
    active: false,
  },
  //disabled: true,
});

$(() => {
  slider.render($(".slider__wrapper"));
});
