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
const orderBy_1 = __importDefault(require("lodash/orderBy"));
const pubsub_1 = __importDefault(require("../../helpers/pubsub"));
const utils_1 = require("../../helpers/utils");
class DotView extends pubsub_1.default {
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
        if (this.props && !isUndefined_1.default(get_1.default(this.addition, ['value']))) {
            this.view = jquery_1.default('<div/>', this.prepareAttr());
            this.initHandles();
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
        const className = this.props?.dot?.className || '';
        const value = get_1.default(this.addition, ['value']);
        let values = get_1.default(this.props, ['values']);
        let active = false;
        if (!isUndefined_1.default(values) && !isUndefined_1.default(value)) {
            if (values.length === 1) {
                active = value <= values[0];
            }
            else if (values.length > 1) {
                values = orderBy_1.default(values);
                if (value >= values[0] && value <= values[values.length - 1]) {
                    active = true;
                }
            }
            return classnames_1.default(`${prefixCls}__dot`, className, {
                [`${prefixCls}__dot_active`]: active,
            });
        }
        return '';
    }
    prepareStyle() {
        let readyStyle;
        if (this.props) {
            const value = get_1.default(this.addition, ['value'], 0);
            const style = this.props?.dot?.style || {};
            const { vertical, min, max, reverse } = this.props;
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
            });
            return readyStyle;
        }
        return readyStyle;
    }
    updateView() {
        if (this.view) {
            this.view.attr(this.prepareAttr());
        }
        else {
            this.createView();
        }
    }
    handleViewClick(event) {
        if (this.view && this.props) {
            const { value, handles, index = 0 } = this.addition;
            const handleViewClick = get_1.default(handles, ['handleViewClick']);
            if (!isUndefined_1.default(value) && handleViewClick) {
                handleViewClick(index, event, value);
            }
        }
    }
    initHandles() {
        if (this.view) {
            this.view.off('click', this.handleViewClick);
            this.view.on('click', this.handleViewClick);
        }
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DotView.prototype, "handleViewClick", null);
exports.default = DotView;
//# sourceMappingURL=view.js.map