import $ from "jquery";
import get from "lodash/get";
import set from "lodash/set";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import trim from "lodash/trim";
import isUndefined from "lodash/isUndefined";
import isString from "lodash/isString";
import merge from "lodash/merge";
import orderBy from "lodash/orderBy";

import { uniqId, ensureValueInRange } from "../src/helpers/utils";
import { style, render, Props, KeyProps } from "../src/types";
import Slider from "../src/index";
import "./components/example/example";
import "./index.scss";

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
    this.slider = this.$sliderWrapper
      .slider({ onAfterChange: this.onAfterChange })
      .data(Slider.PLUGIN_NAME);
    this.initHandlers();
    this.updateProps();
  };

  private initHandlers = () => {
    this.$sections.each(this.initHandler);
  };

  private initHandler = (index: number, element: HTMLElement) => {
    $(element).on("click", this.handleClickSection);
    $(element).on("input", this.handleInputSection);
    $(element).on("focusout", this.handleFocusoutSection);
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
    const props = merge({}, this.props);
    this.getProps();
    if (this.checkNeedUpdate(props)) {
      this.setProps();
    }
  };

  private checkNeedUpdate = (props?: Props): boolean => {
    const prev = JSON.stringify(props);
    const next = JSON.stringify(this.props);
    if (prev !== next) {
      return true;
    }
    return false;
  };

  private onAfterChange = (values?: number[]): void => {
    if (!values || !this.props) {
      return;
    }
    const prev = JSON.stringify(
      orderBy(get(this.props, ["values"], []), [], ["asc"])
    );
    const next = JSON.stringify(orderBy(values || [], [], ["asc"]));

    if (next === prev) {
      return;
    }
    set(this.props, ["values"], values);
    $(".js-input_control", this.$sections).each(
      (index, element: HTMLElement) => {
        const type = get($(element).data("data"), ["type"]);
        if (type === "values") {
          $(".js-input__input", element).val(values[index]);
        }
      }
    );
  };

  private handleClickSection = (event: JQuery.Event): void => {
    const target: HTMLElement = get(event, ["target"]);
    const currentTarget: HTMLElement = get(event, ["currentTarget"]);
    if (target) {
      this.removeHandle(target, currentTarget);
      this.addHandle(target, currentTarget);
    }
  };

  private handleInputSection = (event: JQuery.Event) => {
    const target: HTMLElement = get(event, ["target"]);
    if (target && $(target).attr("type") === "checkbox") {
      this.updateProps();
    }
  };

  private handleFocusoutSection = (event: JQuery.Event) => {
    const target: HTMLElement = get(event, ["target"]);
    if (
      target &&
      ["number", "text"].indexOf($(target).attr("type") || "") !== -1
    ) {
      this.updateProps();
    }
  };

  private getSectionItems = (
    currentTarget: HTMLElement
  ): JQuery<HTMLElement> => {
    return $(".js-section__item_control", currentTarget);
  };

  private addHandle = (
    target: HTMLElement,
    currentTarget: HTMLElement
  ): void => {
    if ($(target).closest(".js-button_add").length) {
      const $items = this.getSectionItems(currentTarget);
      if ($items.length > 0) {
        const $lastItem = $($items.slice(-1));
        const $last = $lastItem.clone();
        $last.removeClass("section__item_first");
        const $inputControl = $(".js-input", $last);
        $inputControl.removeClass("input_first");
        let key = $inputControl.data("key");
        key += 1;
        $inputControl.attr({ "data-key": key });
        const $span = $(".js-input__section-key", $last);
        $span.text(`${key + 1}:`);
        const $input = $(".js-input__input", $last);
        $input.attr({ id: uniqId });
        const max = get(this.props, ["max"], 0);
        const min = get(this.props, ["min"], 0);
        const value =
          parseFloat(String($(".js-input__input", $lastItem).val())) +
          (max - min) * 1e-1;
        if (!isUndefined(value) && !isNaN(value)) {
          $input.val(ensureValueInRange(value, { max, min }));
        }
        $lastItem.after($last);
        this.updateProps();
      }
    }
  };

  private updateHandles = (currentTarget: HTMLElement) => {
    $(".js-section__item_control", currentTarget).each(this.updateHandle);
  };

  private updateHandle = (index: number, element: HTMLElement) => {
    const $element = $(element);
    const $inputControl = $(".js-input", $element);
    if (index === 0) {
      $element.addClass(["section__item_first", "js-section__item_first"]);
      $inputControl.addClass(["input_first", "js-input_first"]);
    } else {
      $element.removeClass(["section__item_first", "js-section__item_first"]);
      $inputControl.removeClass(["input_first", "js-input_first"]);
    }
    $inputControl.attr({ "data-key": index });
    const $span = $(".js-input__section-key", $element);
    $span.text(`${index + 1}:`);
  };

  private removeHandle = (
    target: HTMLElement,
    currentTarget: HTMLElement
  ): void => {
    if ($(target).closest(".js-button_remove").length) {
      const $items = this.getSectionItems(currentTarget);
      if ($items.length > 1) {
        const $item = $(target).closest(".js-section__item_control");
        if ($item.length) {
          $item.remove();
          this.updateHandles(currentTarget);
          this.updateProps();
        }
      }
    }
  };

  private processingSection = (index: number, element: HTMLElement): void => {
    $(".input", element).each(this.processingInput);
  };

  private processingInput = (index: number, element: HTMLElement): void => {
    const { property, type } = get($(element).data(), ["data"]) || {};
    let value = this.prepareValue(element, property);
    this.prepareProp(value, type, property);
  };

  private prepareProp = (
    value?: unknown,
    type?: KeyProps,
    property?: string
  ): undefined => {
    if (!type || !property) {
      return;
    }
    if (property === "values") {
      if (type === "values" && !isUndefined(value)) {
        this.props = {
          ...this.props,
          values: [...(this.props?.values || []), value as number],
        };
      } else if (type === "mark" && !isUndefined(value)) {
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
        "push",
        "precision",
        "indent",
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

  private prepareValue = (
    element?: HTMLElement,
    property?: string
  ): unknown => {
    let value;
    if (!(element instanceof HTMLElement) || !trim(property)) {
      return;
    }
    value = $("input", element).val();
    if (isUndefined(value)) {
      return;
    }
    switch (property) {
      case "values":
      case "min":
      case "max":
      case "step":
      case "precision":
      case "indent": {
        if (isNaN(Number(value)) || isNaN(parseFloat(String(value)))) {
          return;
        }
        return parseFloat(String(value));
      }
      case "disabled":
      case "vertical":
      case "reverse":
      case "push":
      case "on":
      case "dot":
      case "always": {
        value = $("input", element).prop("checked");
        return Boolean(value);
      }
      case "classNames":
      case "styles": {
        return this.prepareArray(value);
      }
      case "className":
      case "wrapClassName": {
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

  private prepareArray = (string?: unknown): undefined | string[] => {
    const result = this.prepareJSON(string);
    if (isArray(result)) {
      return result;
    }
    return;
  };

  private prepareObject = (string?: unknown): undefined | style => {
    const result = this.prepareJSON(string);
    if (isObject(result) && !isArray(result) && !isFunction(result)) {
      return result;
    }
    return;
  };

  private prepareFunction = (string?: unknown): undefined | render => {
    let result;
    if (!isString(string) || !trim(string)) {
      return result;
    }
    try {
      result = new Function("v", string);
      result(0);
    } catch (error) {
      return;
    }
    if (isFunction(result)) {
      return result;
    }
    return;
  };

  private prepareJSON = (
    json?: unknown
  ): undefined | style | string[] | render => {
    let result;
    if (!isString(json) || !trim(json)) {
      return result;
    }
    if (json) {
      try {
        result = JSON.parse(json);
      } catch (error) {}
    }
    return result;
  };
}

function renderExample(this: HTMLElement): void {
  new Example(this);
}

function renderComponent() {
  $(".js-example").each(renderExample);
}

$(renderComponent);
