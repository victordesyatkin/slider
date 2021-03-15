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
const uniq_1 = __importDefault(require("lodash.uniq"));
const orderBy_1 = __importDefault(require("lodash.orderby"));
const isArray_1 = __importDefault(require("lodash.isarray"));
const pubsub_1 = __importDefault(require("../../helpers/pubsub"));
const view_1 = __importDefault(require("../dot/view"));
class DotsView extends pubsub_1.default {
    constructor(addition) {
        super();
        this.dots = [];
        this.isRendered = false;
        this.addition = addition;
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
    setProps(props) {
        this.props = props;
        this.updateView();
        this.createOrUpdateSubViews();
        this.appendSubViews();
        this.render();
    }
    remove() {
        if (this.view) {
            this.view.remove();
            this.view = undefined;
            this.dots = [];
            this.isRendered = false;
        }
    }
    getAddition() {
        return this.addition;
    }
    setAddition(addition) {
        this.addition = addition;
    }
    static cleanSubView(views, count) {
        const { length } = views;
        if (length > count) {
            for (let index = count; index < length; index += 1) {
                if (views[index]) {
                    views[index].remove();
                }
            }
            views.splice(count);
        }
    }
    createView() {
        if (this.props) {
            const on = this.props?.dot?.on;
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
        const className = this.props?.dot?.wrapClassName;
        const vertical = get_1.default(this.props, ['vertical']);
        return classnames_1.default(`${prefixCls}__dots`, className, {
            [`${prefixCls}__dots_vertical`]: vertical,
        });
    }
    prepareStyle() {
        let readyStyle;
        if (this.props) {
            readyStyle = '';
        }
        return readyStyle;
    }
    updateView() {
        if (this.view) {
            if (get_1.default(this.props, ['dot', 'on'])) {
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
    createOrUpdateSubViews() {
        this.dots = this.createOrUpdateSubView(this.dots, view_1.default);
    }
    createOrUpdateSubView(views, SubView) {
        const readyViews = [...views];
        if (this.props && this.view) {
            const { min, max, step, reverse } = this.props;
            let values = [];
            const on = this.props?.mark?.dot;
            if (on) {
                const markValues = this.props?.mark?.values;
                if (isArray_1.default(markValues)) {
                    values = [...markValues];
                }
            }
            if (step) {
                for (let index = min; index <= max; index += step) {
                    values.push(index);
                }
            }
            const { handles } = this.addition;
            values = orderBy_1.default(uniq_1.default(values), [], reverse ? 'desc' : 'asc');
            const { length } = values;
            for (let index = 0; index < length; index += 1) {
                if (readyViews[index]) {
                    readyViews[index].setAddition({
                        index,
                        handles,
                        value: values[index],
                    });
                    readyViews[index].setProps(this.props);
                }
                else {
                    readyViews[index] = new SubView({
                        index,
                        handles,
                        value: values[index],
                    });
                    readyViews[index].setProps(this.props);
                }
            }
            DotsView.cleanSubView(readyViews, values.length);
        }
        return readyViews;
    }
    appendSubViews() {
        if (this.view) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            this.dots.forEach(this.appendSubView);
        }
    }
    appendSubView(subView) {
        if (this.view) {
            subView.render(this.view);
        }
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DotsView.prototype, "appendSubView", null);
exports.default = DotsView;
//# sourceMappingURL=view.js.map