import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const slider = new SliderPresenter({
  prefixCls: "slider",
  value: [0, 10, 40, 70],
});

$(() => {
  slider.render($(".slider__wrapper"));
});
