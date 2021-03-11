"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const classnames_1 = __importDefault(require("classnames"));
const get_1 = __importDefault(require("lodash/get"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const pubsub_1 = __importDefault(require("../../helpers/pubsub"));
const utils_1 = require("../../helpers/utils");
class TooltipView extends pubsub_1.default {
    constructor(addition) {
        super();
        this.isRendered = false;
        this.addition = addition;
    }
    setProps(props) {
        this.props = props;
        this.updateView();
        this.prepareContent();
        this.render();
    }
    render(parent) {
        if (parent) {
            this.parent = parent;
        }
        if (!this.isRendered) {
            if (this.parent && this.view) {
                this.parent.append(this.view);
                this.isRendered = true;
            }
        }
    }
    remove() {
        if (this.view) {
            this.view.remove();
            this.view = undefined;
            this.isRendered = false;
        }
    }
    getAddition() {
        return this.addition;
    }
    setAddition(addition) {
        this.addition = addition;
    }
    createView() {
        if (this.props && !isUndefined_1.default(get_1.default(this.addition, ['value']))) {
            this.view = jquery_1.default('<div/>', this.prepareAttr());
        }
    }
    prepareAttr() {
        const attr = {
            class: this.prepareClassName(),
            style: this.prepareStyle(),
        };
        return attr;
    }
    prepareClassName() {
        const prefixCls = get_1.default(this.props, ['prefixCls'], '');
        const className = this.props?.tooltip?.className || '';
        const always = this.props?.tooltip?.always;
        return classnames_1.default(`${prefixCls}__tooltip`, className, {
            [`${prefixCls}__tooltip_always`]: always,
        });
    }
    prepareStyle() {
        let readyStyle;
        if (this.props) {
            const style = this.props?.tooltip?.style || {};
            const positionStyle = {};
            readyStyle = utils_1.objectToString({
                ...style,
                ...positionStyle,
            });
        }
        return readyStyle;
    }
    prepareContent() {
        if (this.view) {
            const { value } = this.addition;
            if (!isUndefined_1.default(value)) {
                const render = this.props?.tooltip?.render;
                let content = `${value}`;
                if (render) {
                    content = render(value);
                }
                if (content) {
                    this.view.empty().append(content);
                }
            }
        }
    }
    updateView() {
        if (this.view) {
            if (get_1.default(this.props, ['tooltip', 'on'])) {
                this.view.attr(this.prepareAttr());
            }
            else {
                this.remove();
            }
        }
        else {
            this.createView();
        }
    }
}
exports.default = TooltipView;
//# sourceMappingURL=view.js.map