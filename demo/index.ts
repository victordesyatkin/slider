import $, { isFunction } from "jquery";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import isNumber from "lodash/isNumber";
import { style, render } from "../src/types";

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
  private $sliderWrapper: JQuery<HTMLElement>;
  private $sections?: JQuery<HTMLElement>;
  private slider?: Slider;
  private props?: Props;

  constructor(parent: HTMLElement) {
    this.$parent = $(parent);
    this.$sliderWrapper = $(".js-example__slider", this.$parent);
    this.$sections;
    this.getProps();
    this.init();
  }

  private init = (): void => {
    this.slider = this.$sliderWrapper.slider().data(Slider.PLUGIN_NAME);
  };

  private getProps = (): void => {
    const props: Props = {};
    this.$sections = $(".section", this.$parent);
    this.$sections.each(this.processingSection);
  };

  private setProps = (): void => {
    if (this.props && this.slider) {
      this.slider.setProps(this.props);
    }
  };

  private processingSection = (index: number, el: HTMLElement) => {
    console.log(`${index}-`, el);
    const $inputs = $(".input", el).each(this.processingInput);
  };

  private processingInput = (index: number, el: HTMLElement) => {
    const { property, type } = $(el).data() || {};
    let value = $("input", el).val();
    switch (type) {
      case "values": {
        if (value && isNumber(value)) {
          this.props = {
            values: [...get(this.props, ["values"], []), value],
          };
        }
        break;
      }
      default: {
      }
    }
    console.log("value :", value);
  };

  private prepareArray = (s?: string): undefined | string[] => {
    const r = this.prepareJSON(s);
    if (isArray(r)) {
      return r;
    }
    return;
  };

  private prepareObject = (s?: string): undefined | style => {
    const r = this.prepareJSON(s);
    if (isObject(r) && !isArray(r) && !isFunction(r)) {
      return r;
    }
    return;
  };

  private prepareFunction = (s?: string): undefined | render => {
    const r = this.prepareJSON(s);
    if (isFunction(r) && !isObject(r) && !isArray(r)) {
      return r;
    }
    return;
  };

  private prepareJSON = (
    json?: string
  ): undefined | style | string[] | render => {
    let r;
    if (json) {
      try {
        r = JSON.parse(json);
      } catch (error) {}
    }
    return r;
  };
}

$(function renderComponent() {
  const components: Example[] = [];
  $(".js-example").each(function () {
    components.push(new Example(this));
  });
});
