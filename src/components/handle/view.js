"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const classnames_1 = __importDefault(require("classnames"));
const bind_decorator_1 = __importDefault(require("bind-decorator"));
const get_1 = __importDefault(require("lodash/get"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const pubsub_1 = __importDefault(require("../../helpers/pubsub"));
const utils_1 = require("../../helpers/utils");
const view_1 = __importDefault(require("../tooltip/view"));
class HandleView extends pubsub_1.default {
    constructor(addition) {
        super();
        this.isRendered = false;
        this.addition = addition;
    }
    setProps(props) {
        this.props = props;
        this.updateView();
        this.appendTooltip();
        this.render();
    }
    getProps() {
        return this.props;
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
        if (this.props) {
            this.view = jquery_1.default('<div/>', this.prepareAttr());
            this.initHandles();
        }
    }
    handleViewMouseDown(event) {
        const handleViewMouseDown = this.addition?.handles?.handleViewMouseDown;
        const index = get_1.default(this.addition, ['index']);
        if (!isUndefined_1.default(index) && handleViewMouseDown) {
            handleViewMouseDown(index, event);
        }
    }
    prepareAttr() {
        const attr = {
            class: this.prepareClassName(),
            style: this.prepareStyle(),
            tabindex: -1,
        };
        return attr;
    }
    prepareClassName() {
        const prefixCls = get_1.default(this.props, ['prefixCls'], '');
        const index = get_1.default(this.addition, ['index']);
        const className = this.props?.handle?.classNames?.[index] || '';
        const active = get_1.default(this.addition, ['active']);
        return classnames_1.default(`${prefixCls}__handle`, className, {
            [`${prefixCls}__handle_active`]: active,
        });
    }
    prepareStyle() {
        let readyStyle;
        if (this.props) {
            const index = get_1.default(this.addition, ['index']);
            const style = this.props?.handle?.styles?.[index] || {};
            const { values, min, max, vertical, reverse } = this.props;
            const value = values[index];
            const offset = utils_1.calcOffset(value, min, max);
            const positionStyle = vertical
                ? {
                    [reverse ? 'top' : 'bottom']: `${offset}%`,
                    [reverse ? 'bottom' : 'top']: 'auto',
                    transform: reverse ? 'none' : `translateY(+50%)`,
                }
                : {
                    [reverse ? 'right' : 'left']: `${offset}%`,
                    [reverse ? 'left' : 'right']: 'auto',
                    transform: `translateX(${reverse ? '+' : '-'}50%)`,
                };
            readyStyle = utils_1.objectToString({
                ...style,
                ...positionStyle,
                'z-index': `${index + 10}`,
            });
        }
        return readyStyle;
    }
    isProps() {
        return !!(this.view && this.props);
    }
    appendTooltip() {
        const on = this.props?.tooltip?.on;
        if (on && this.isProps()) {
            const index = get_1.default(this.addition, ['index']);
            const value = get_1.default(this.props, ['values', index]);
            if (!isUndefined_1.default(value)) {
                if (this.tooltip) {
                    this.tooltip.setAddition({ value, index });
                    if (this.props) {
                        this.tooltip.setProps(this.props);
                    }
                }
                else {
                    this.tooltip = new view_1.default({ value, index });
                    if (this.props) {
                        this.tooltip.setProps(this.props);
                    }
                    this.tooltip.render(this.view);
                }
            }
        }
        else if (this.tooltip && this.view) {
            this.tooltip.remove();
            this.tooltip = undefined;
            this.view.empty();
        }
    }
    updateView() {
        if (this.view) {
            this.view.attr(this.prepareAttr());
        }
        else {
            this.createView();
        }
    }
    initHandles() {
        if (this.view) {
            this.view.off({
                mousedown: this.handleViewMouseDown,
            });
            this.view.on({
                mousedown: this.handleViewMouseDown,
            });
        }
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HandleView.prototype, "handleViewMouseDown", null);
exports.default = HandleView;
//# sourceMappingURL=view.js.map