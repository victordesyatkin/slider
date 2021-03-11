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
const bind_decorator_1 = __importDefault(require("bind-decorator"));
const classnames_1 = __importDefault(require("classnames"));
const get_1 = __importDefault(require("lodash/get"));
const utils_1 = require("../helpers/utils");
const pubsub_1 = __importDefault(require("../helpers/pubsub"));
const view_1 = __importDefault(require("../components/rail/view"));
const view_2 = __importDefault(require("../components/handle/view"));
const view_3 = __importDefault(require("../components/track/view"));
const view_4 = __importDefault(require("../components/dots/view"));
const view_5 = __importDefault(require("../components/marks/view"));
class View extends pubsub_1.default {
    constructor() {
        super(...arguments);
        this.rails = [];
        this.tracks = [];
        this.handles = [];
        this.dots = [];
        this.marks = [];
        this.isRendered = false;
    }
    setProps(props) {
        this.props = props;
        this.updateView();
        this.createOrUpdateSubViews();
        this.appendSubViews();
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
        this.view = jquery_1.default('<div/>', this.prepareAttr());
    }
    updateView() {
        if (!this.view) {
            this.createView();
        }
        else {
            this.view.attr(this.prepareAttr());
        }
    }
    prepareAttr() {
        return {
            class: this.prepareClassName(),
            style: this.prepareStyle(),
        };
    }
    prepareClassName() {
        const { prefixCls = '', mark, disabled, vertical, classNames } = this.props || {};
        return classnames_1.default(prefixCls, {
            [`${prefixCls}_with-mark`]: mark?.on,
            [`${prefixCls}_disabled`]: disabled,
            [`${prefixCls}_vertical`]: vertical,
            classNames,
        });
    }
    prepareStyle() {
        return utils_1.objectToString({ ...get_1.default(this.props, ['style']) });
    }
    handleWindowMouseUpForHandleFocusout(event) {
        const { target } = event;
        if (target && this.view) {
            const $target = jquery_1.default(target);
            if (!$target.closest(this.view).length) {
                this.publish('setIndex', { index: -1 });
                jquery_1.default(window).off({
                    mouseup: this.handleWindowMouseUpForHandleFocusout,
                });
            }
        }
    }
    handleViewClick(index, event) {
        jquery_1.default(window).off({ mouseup: this.handleWindowMouseUpForHandleFocusout });
        jquery_1.default(window).on({ mouseup: this.handleWindowMouseUpForHandleFocusout });
        const { clientY: coordinateY = 0, pageX: coordinateX = 0 } = event || {};
        this.publish('onChange', {
            coordinateX,
            coordinateY,
            start: utils_1.getSliderStart({ props: this.props, view: this.view }),
            length: utils_1.getSliderLength({ props: this.props, view: this.view }),
            action: 'onAfterChange',
        });
    }
    handleViewMouseDown(index) {
        jquery_1.default(window).on({ mousemove: this.handleWindowMouseMove });
        jquery_1.default(window).on({ mouseup: this.handleWindowMouseUp });
        jquery_1.default(window).off({ mouseup: this.handleWindowMouseUpForHandleFocusout });
        this.publish('onBeforeChange', { index });
    }
    handleWindowMouseUp() {
        jquery_1.default(window).off({ mousemove: this.handleWindowMouseMove });
        jquery_1.default(window).off({ mouseup: this.handleWindowMouseUp });
        jquery_1.default(window).on({ mouseup: this.handleWindowMouseUpForHandleFocusout });
        this.publish('onAfterChange');
    }
    handleWindowMouseMove(event) {
        const { clientY: coordinateY = 0, pageX: coordinateX = 0 } = event || {};
        this.publish('onChange', {
            coordinateX,
            coordinateY,
            start: utils_1.getSliderStart({ props: this.props, view: this.view }),
            length: utils_1.getSliderLength({ props: this.props, view: this.view }),
        });
    }
    createOrUpdateSubViews() {
        const count = utils_1.getCount(this.props);
        this.rails = this.createOrUpdateSubView(this.rails, 1, view_1.default, 'click');
        this.tracks = this.createOrUpdateSubView(this.tracks, count - 1 || 1, view_3.default);
        this.dots = this.createOrUpdateSubView(this.dots, 1, view_4.default, 'click');
        this.marks = this.createOrUpdateSubView(this.marks, 1, view_5.default, 'click');
        this.handles = this.createOrUpdateSubView(this.handles, count, view_2.default, 'mousedown', true);
    }
    createOrUpdateSubView(views, count, SubView, action, withActive) {
        const readyViews = [...views];
        if (this.props) {
            let handles;
            let active;
            const { index: readyIndex } = this.props;
            if (action === 'mousedown') {
                handles = {
                    handleViewMouseDown: this.handleViewMouseDown,
                };
            }
            else if (action === 'click') {
                if (utils_1.getCount(this.props) > 0) {
                    handles = {
                        handleViewClick: this.handleViewClick,
                    };
                }
            }
            for (let index = 0; index < count; index += 1) {
                if (withActive) {
                    active = index === readyIndex;
                }
                if (readyViews[index]) {
                    let addition = readyViews[index].getAddition();
                    addition = { ...addition, handles, active };
                    readyViews[index].setAddition(addition);
                    readyViews[index].setProps(this.props);
                }
                else {
                    readyViews[index] = new SubView({ index, handles, active });
                    readyViews[index].setProps(this.props);
                }
            }
            View.cleanSubView(readyViews, count);
        }
        return readyViews;
    }
    appendSubViews() {
        if (this.view) {
            this.rails.forEach(this.appendSubView);
            this.marks.forEach(this.appendSubView);
            this.dots.forEach(this.appendSubView);
            this.tracks.forEach(this.appendSubView);
            this.handles.forEach(this.appendSubView);
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
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], View.prototype, "handleWindowMouseUpForHandleFocusout", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], View.prototype, "handleViewClick", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], View.prototype, "handleViewMouseDown", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], View.prototype, "handleWindowMouseUp", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], View.prototype, "handleWindowMouseMove", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], View.prototype, "appendSubView", null);
exports.default = View;
//# sourceMappingURL=view.js.map