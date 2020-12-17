import $ from "jquery";
import get from "lodash/get";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import trim from "lodash/trim";
import isUndefined from "lodash/isUndefined";
import isString from "lodash/isString";

import { style, render, Props, KeyProps } from "../src/types";
import Slider from "../src/index";
import { uniq, ensureValueInRange } from "../src/helpers/utils";

import "./index.scss";

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(
  require.context("./components", true, /^\.\/(?!.*(?:__tests__)).*\.(ts?)$/)
);

class Example {
  private $parent: JQuery<HTMLElement>;
  private $sliderWrapper: JQuery<HTMLElement>;
  private $sections: JQuery<HTMLElement>;
  private slider?: Slider;
  private props?: Props;

  constructor(parent: HTMLElement) {
    this.$parent = $(parent);
    this.$sliderWrapper = $(".js-slider__dummy", this.$parent);
    this.$sections = $(".section", this.$parent);
    this.init();
  }

  private init = (): void => {
    this.slider = this.$sliderWrapper.slider().data(Slider.PLUGIN_NAME);
    this.initHandlers();
    this.updateProps();
  };

  private initHandlers = () => {
    this.$sections.each(this.initHandler);
  };

  private initHandler = (index: number, el: HTMLElement) => {
    $(el).on("click", this.onClick);
    $(el).on("input", this.onInput);
  };

  private getProps = (): Props => {
    this.props = {};
    this.$sections.each(this.processingSection);
    return this.props;
  };

  private setProps = (): void => {
    if (this.props && this.slider) {
      this.slider.setProps(this.props);
    }
  };

  private updateProps = (): void => {
    this.getProps();
    this.setProps();
  };

  private onClick = (e: JQuery.Event): void => {
    const target: HTMLElement = get(e, ["target"]);
    const currentTarget: HTMLElement = get(e, ["currentTarget"]);
    if (target) {
      this.removeHandle(target, currentTarget);
      this.addHandle(target, currentTarget);
    }
  };

  private onInput = (e: JQuery.Event) => {
    const target: HTMLElement = get(e, ["target"]);
    const currentTarget: HTMLElement = get(e, ["currentTarget"]);
    if (target) {
      this.updateProps();
      console.log("target : ", target);
      console.log("value : ", $(target).prop("checked"));
      console.log("this.props :", this.props);
    }
  };

  private getSectionItems = (
    currentTarget: HTMLElement
  ): JQuery<HTMLElement> => {
    return $(".js-section__item-control", currentTarget);
  };

  private addHandle = (
    target: HTMLElement,
    currentTarget: HTMLElement
  ): void => {
    if ($(target).closest(".js-button-add").length) {
      const $items = this.getSectionItems(currentTarget);
      if ($items.length > 0) {
        const $lastItem = $($items.slice(-1));
        const $last = $lastItem.clone();
        $last.removeClass("section__item_first");
        const $inputControl = $(".js-input", $last);
        let key = $inputControl.data("key");
        key += 1;
        $inputControl.attr({ "data-key": key });
        const $span = $(".js-input__section-key", $last);
        $span.text(`${key + 1}:`);
        const $input = $(".js-input__input", $last);
        $input.attr({ id: uniq });
        const max = get(this.props, ["max"], 0);
        const min = get(this.props, ["min"], 0);
        const value =
          parseFloat(String($(".js-input__input", $lastItem).val()) || "0") +
          (max - min) * 1e-1;
        if (!isUndefined(value) && !isNaN(value)) {
          $input.val(value); //ensureValueInRange(value, { max, min })
        }
        $lastItem.after($last);
        this.updateProps();
      }
    }
  };

  private updateHandles = (currentTarget: HTMLElement) => {
    $(".js-section__item-control", currentTarget).each(this.updateHandle);
  };

  private updateHandle = (index: number, el: HTMLElement) => {
    const $el = $(el);
    if (index === 0) {
      $el.addClass("section__item_first");
    } else {
      $el.removeClass("section__item_first");
    }
    const $inputControl = $(".js-input", $el);
    $inputControl.attr({ "data-key": index });
    const $span = $(".js-input__section-key", $el);
    $span.text(`${index + 1}:`);
  };

  private removeHandle = (
    target: HTMLElement,
    currentTarget: HTMLElement
  ): void => {
    if ($(target).closest(".js-button-remove").length) {
      const $items = this.getSectionItems(currentTarget);
      if ($items.length > 1) {
        const $item = $(target).closest(".js-section__item-control");
        if ($item.length) {
          $item.remove();
          this.updateHandles(currentTarget);
          this.updateProps();
        }
      }
    }
  };

  private processingSection = (index: number, el: HTMLElement): void => {
    $(".input", el).each(this.processingInput);
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
        [property]: value,
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
        value = $("input", el).prop("checked");
        return Boolean(value);
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
