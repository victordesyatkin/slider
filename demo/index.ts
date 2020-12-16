import $ from "jquery";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import isNumber from "lodash/isNumber";
import isFunction from "lodash/isFunction";
import trim from "lodash/trim";
import isUndefined from "lodash/isUndefined";

import { style, render } from "../src/types";
import Slider from "../src/index";
import { Props, KeyProps } from "../src/types";
import "./index.scss";
import { isString } from "lodash";

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
    const props = this.getProps();
    this.setProps();
  };

  private getProps = (): Props => {
    this.props = {};
    this.$sections = $(".section", this.$parent);
    this.$sections.each(this.processingSection);
    return this.props;
  };

  private setProps = (): void => {
    if (this.props && this.slider) {
      this.slider.setProps(this.props);
    }
  };

  private processingSection = (index: number, el: HTMLElement): void => {
    const $inputs = $(".input", el).each(this.processingInput);
  };

  private processingInput = (index: number, el: HTMLElement): void => {
    const { property, type } = get($(el).data(), ["data"]) || {};
    let value = this.prepareValue(el, property);
    this.prepareProp(value, type, property);
  };

  private prepareProp = (
    value?: unknown,
    type?: KeyProps,
    property?: string
  ): undefined => {
    if (!type || !property || isUndefined(value)) {
      return;
    }
    if (property === "precision") {
      console.log("prepareProp : ", typeof value);
    }
    if (property === "values") {
      if (type === "values") {
        this.props = {
          ...this.props,
          values: [...(this.props?.values || []), value as number],
        };
      } else if (type === "mark") {
        this.props = {
          ...this.props,
          mark: {
            ...(this.props?.mark || {}),
            values: [...(this.props?.mark?.values || []), value as number],
          },
        };
      }
    } else if (
      [
        "min",
        "max",
        "step",
        "disabled",
        "vertical",
        "reverse",
        "allowCross",
      ].indexOf(property) !== -1
    ) {
      this.props = {
        ...this.props,
        [property]: value as number,
      };
    } else {
      this.props = {
        ...this.props,
        [type]: {
          ...((this.props || {})[type] as object),
          [property]: value,
        },
      };
    }
    return;
  };

  private prepareValue = (el?: HTMLElement, property?: string): unknown => {
    let value;
    if (!(el instanceof HTMLElement) || !trim(property)) {
      return;
    }
    value = $("input", el).val();
    if (isUndefined(value)) {
      return;
    }
    switch (property) {
      case "values":
      case "min":
      case "max":
      case "step":
      case "precision": {
        if (isNaN(Number(value)) || isNaN(parseFloat(String(value)))) {
          return;
        }
        return parseFloat(String(value));
      }
      case "disabled":
      case "vertical":
      case "reverse":
      case "allowCross":
      case "on": {
        return Boolean(parseFloat(String(value)));
      }
      case "classNames":
      case "styles": {
        return this.prepareArray(value);
      }
      case "className": {
        if (!isString(value) || !trim(value)) {
          return;
        }
        return trim(value);
      }
      case "style": {
        return this.prepareObject(value);
      }
      case "render": {
        return this.prepareFunction(value);
      }
      default: {
        return;
      }
    }
  };

  private prepareArray = (s?: unknown): undefined | string[] => {
    const r = this.prepareJSON(s);
    if (isArray(r)) {
      return r;
    }
    return;
  };

  private prepareObject = (s?: unknown): undefined | style => {
    const r = this.prepareJSON(s);
    if (isObject(r) && !isArray(r) && !isFunction(r)) {
      return r;
    }
    return;
  };

  private prepareFunction = (s?: unknown): undefined | render => {
    let r;
    if (!isString(s) || !trim(s)) {
      return r;
    }
    r = new Function("v", s);
    if (isFunction(r)) {
      return r;
    }
    return;
  };

  private prepareJSON = (
    json?: unknown
  ): undefined | style | string[] | render => {
    let r;
    if (!isString(json) || !trim(json)) {
      return r;
    }
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
