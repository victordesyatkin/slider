import $ from "jquery";
import get from "lodash/get";

import "./index.scss";
import Slider from "../src/index";
import { Props } from "../src/types";

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(
  require.context("./components", true, /^\.\/(?!.*(?:__tests__)).*\.(ts?)$/)
);

class Example {
  private $parent: JQuery<HTMLElement>;
  private $panel: JQuery<HTMLElement>;
  private $sliderWrapper: JQuery<HTMLElement>;
  private slider?: Slider;
  private props?: Props;

  constructor(parent: HTMLElement) {
    this.$parent = $(parent);
    this.$panel = $(".js-example__panel", this.$parent);
    this.$sliderWrapper = $(".js-example__slider", this.$parent);
    this.init();
  }

  private init() {
    this.props = get(this.$parent.data(), ["slider", "props"]);
    console.log("sliderWrapper : ", this.$sliderWrapper);
    this.slider = this.$sliderWrapper
      .slider(this.props)
      .data(Slider.PLUGIN_NAME);
  }
}

$(function renderComponent() {
  const components: Example[] = [];
  $(".js-example").each(function () {
    components.push(new Example(this));
  });
});
