"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlider = exports.Slider = void 0;
const jquery_1 = __importDefault(require("jquery"));
const pick_1 = __importDefault(require("lodash/pick"));
const utils_1 = require("../helpers/utils");
const model_1 = __importDefault(require("./model"));
const view_1 = __importDefault(require("./view"));
const presenter_1 = __importDefault(require("./presenter"));
class Slider {
    constructor(element, props) {
        this.model = new model_1.default(utils_1.prepareData(props));
        this.view = new view_1.default();
        this.presenter = new presenter_1.default(this.model, this.view);
        this.view.render(element);
    }
    getProps() {
        const defaultProps = this.presenter.getProps();
        return defaultProps;
    }
    setProps(props) {
        this.presenter.setProps(props);
    }
    pickProps(keys) {
        return pick_1.default(this.presenter.getProps(), keys);
    }
}
exports.Slider = Slider;
Slider.PLUGIN_NAME = 'slider';
function createSlider($element, props) {
    return $element.each(function each() {
        const $this = jquery_1.default(this);
        if (!$this.data(Slider.PLUGIN_NAME)) {
            $this.data(Slider.PLUGIN_NAME, new Slider($this, props));
        }
        else if ($this.data(Slider.PLUGIN_NAME)) {
            const slider = $this.data(Slider.PLUGIN_NAME);
            if (slider) {
                slider.setProps(props);
            }
        }
    });
}
exports.createSlider = createSlider;
//# sourceMappingURL=index.js.map