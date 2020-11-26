import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const slider = new SliderPresenter({
  prefixCls: "slider",
});

$(() => {
  slider.render($(".slider__wrapper"));
});
