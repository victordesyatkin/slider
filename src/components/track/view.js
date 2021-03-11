"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const classnames_1 = __importDefault(require("classnames"));
const get_1 = __importDefault(require("lodash/get"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const utils_1 = require("../../helpers/utils");
const pubsub_1 = __importDefault(require("../../helpers/pubsub"));
class TrackView extends pubsub_1.default {
    constructor(addition) {
        super();
        this.isRendered = false;
        this.addition = addition;
    }
    setProps(props) {
        this.props = props;
        this.updateView();
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
        if (this.props && !isUndefined_1.default(get_1.default(this.addition, ['index']))) {
            const on = this.props?.track?.on;
            if (on) {
                this.view = jquery_1.default('<div/>', this.prepareAttr());
            }
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
        const index = get_1.default(this.addition, ['index']);
        const className = this.props?.track?.classNames || '';
        return classnames_1.default(`${prefixCls}__track`, { [`${prefixCls}__track-${index}`]: true }, className);
    }
    prepareStyle() {
        let readyStyle;
        if (this.props) {
            const index = get_1.default(this.addition, ['index']);
            const style = this.props?.track?.styles?.[index] || {};
            const { vertical, min, max } = this.props;
            let { reverse } = this.props;
            const { values, startPoint } = this.props;
            const readyOffset = utils_1.calcOffset(values[index], min, max);
            let offset = readyOffset;
            let length;
            if (values.length > 1) {
                length = utils_1.calcOffset(values[index + 1], min, max) - readyOffset;
            }
            else {
                const trackOffset = startPoint !== undefined ? utils_1.calcOffset(startPoint, min, max) : 0;
                offset = trackOffset;
                length = readyOffset - trackOffset;
            }
            if (length < 0) {
                reverse = !reverse;
                length = Math.abs(length);
                offset = 100 - offset;
            }
            const positionStyle = vertical
                ? {
                    [reverse ? 'top' : 'bottom']: `${offset}%`,
                    [reverse ? 'bottom' : 'top']: 'auto',
                    height: `${length}%`,
                }
                : {
                    [reverse ? 'right' : 'left']: `${offset}%`,
                    [reverse ? 'left' : 'right']: 'auto',
                    width: `${length}%`,
                };
            readyStyle = utils_1.objectToString({
                ...positionStyle,
                ...style,
            });
        }
        return readyStyle;
    }
    updateView() {
        if (this.view) {
            if (get_1.default(this.props, ['track', 'on'])) {
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
exports.default = TrackView;
//# sourceMappingURL=view.js.map