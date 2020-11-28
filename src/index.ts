import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const slider = new SliderPresenter({
  prefixCls: "slider",
  //value: [0, 10, 40, 70],
  value: [-10, 10],
  step: 20,
  dots: true,
  //disabled: true,
});

$(() => {
  slider.render($(".slider__wrapper"));
});
