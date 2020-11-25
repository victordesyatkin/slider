import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const slider = new SliderPresenter({
  prefixCls: "slider",
});

$(() => {
  $(".slider__wrapper").append(slider.render());
});
