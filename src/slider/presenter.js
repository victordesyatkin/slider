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
const bind_decorator_1 = __importDefault(require("bind-decorator"));
class Presenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.setProps(this.model.getProps());
        this.initHandlesView();
        this.initHandlesModel();
    }
    getProps() {
        return this.model.getProps();
    }
    setProps(props) {
        this.model.setProps(props);
    }
    initHandlesView() {
        this.view.subscribe('onBeforeChange', this.onBeforeChange);
        this.view.subscribe('onAfterChange', this.onAfterChange);
        this.view.subscribe('onChange', this.onChange);
        this.view.subscribe('setIndex', this.setIndex);
    }
    initHandlesModel() {
        this.model.subscribe('setPropsForView', this.setPropsForView);
    }
    onChange(options) {
        this.model.onChange(options);
    }
    onAfterChange() {
        this.model.onAfterChange();
    }
    onBeforeChange(options) {
        this.model.onBeforeChange(options);
    }
    setPropsForView(props) {
        this.view.setProps(props);
    }
    setIndex(options) {
        this.model.setIndex(options);
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Presenter.prototype, "onChange", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Presenter.prototype, "onAfterChange", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Presenter.prototype, "onBeforeChange", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Presenter.prototype, "setPropsForView", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Presenter.prototype, "setIndex", null);
exports.default = Presenter;
//# sourceMappingURL=presenter.js.map