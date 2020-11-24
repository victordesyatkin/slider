import $ from "jquery";
import SliderPresenter from "./slider/presenter";
import "./index.scss";

const track = new SliderPresenter({
  prefixCls: "slider",
});

$(() => {
  $(".slider__wrapper").append(track.render());
});
