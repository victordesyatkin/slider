"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const index_1 = require("./slider/index");
require("./style.scss");
(function handleWindowLoaded($) {
    // eslint-disable-next-line no-param-reassign
    $.fn.slider = function makeCreateSlider(props) {
        return index_1.createSlider(this, props);
    };
})(jquery_1.default);
exports.default = index_1.Slider;
//# sourceMappingURL=index.js.map