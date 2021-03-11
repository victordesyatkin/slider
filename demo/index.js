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
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const isArray_1 = __importDefault(require("lodash/isArray"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const trim_1 = __importDefault(require("lodash/trim"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const isString_1 = __importDefault(require("lodash/isString"));
const merge_1 = __importDefault(require("lodash/merge"));
const orderBy_1 = __importDefault(require("lodash/orderBy"));
const utils_1 = require("../src/helpers/utils");
const index_1 = __importDefault(require("../src/index"));
require("./components/example/example");
require("./index.scss");
class Example {
    constructor(parent) {
        this.getSectionItems = (currentTarget) => jquery_1.default('.js-section__item_control', currentTarget);
        this.$parent = jquery_1.default(parent);
        this.$sliderWrapper = jquery_1.default('.js-slider__dummy', this.$parent);
        this.$sections = jquery_1.default('.js-section', this.$parent);
        this.init();
    }
    static prepareFunction(string) {
        let result;
        if (!isString_1.default(string) || !trim_1.default(string)) {
            return result;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            result = new Function('v', string);
            result(0);
        }
        catch (error) {
            result = undefined;
        }
        if (isFunction_1.default(result)) {
            return result;
        }
        return result;
    }
    static prepareArray(string) {
        const result = Example.prepareJSON(string);
        if (isArray_1.default(result)) {
            return result;
        }
        return undefined;
    }
    static isResult(result) {
        return isObject_1.default(result) && !isArray_1.default(result) && !isFunction_1.default(result);
    }
    static prepareObject(string) {
        const result = Example.prepareJSON(string);
        if (Example.isResult(result)) {
            return result;
        }
        return undefined;
    }
    static prepareJSON(json) {
        let result;
        if (!isString_1.default(json) || !trim_1.default(json)) {
            return result;
        }
        if (json) {
            try {
                result = JSON.parse(json);
            }
            catch (error) {
                result = undefined;
            }
        }
        return result;
    }
    static updateHandle(index, element) {
        const $element = jquery_1.default(element);
        const $inputControl = jquery_1.default('.js-input', $element);
        if (index === 0) {
            $element.addClass(['section__item_first', 'js-section__item_first']);
            $inputControl.addClass(['input_first', 'js-input_first']);
        }
        else {
            $element.removeClass(['section__item_first', 'js-section__item_first']);
            $inputControl.removeClass(['input_first', 'js-input_first']);
        }
        $inputControl.attr({ 'data-key': index });
        const $span = jquery_1.default('.js-input__section-key', $element);
        $span.text(`${index + 1}:`);
    }
    static updateHandles(currentTarget) {
        jquery_1.default('.js-section__item_control', currentTarget).each(Example.updateHandle);
    }
    init() {
        this.slider = this.$sliderWrapper
            .slider({ onAfterChange: this.onAfterChange })
            .data(index_1.default.PLUGIN_NAME);
        this.initHandlers();
        this.updateProps();
    }
    initHandlers() {
        this.$sections.each(this.initHandler);
    }
    initHandler(index, element) {
        jquery_1.default(element).on('click', this.handleSectionClick);
        jquery_1.default(element).on('input', this.handleSectionInput);
        jquery_1.default(element).on('focusout', this.handleSectionFocusout);
    }
    getProps() {
        this.props = {};
        this.$sections.each(this.processingSection);
        return this.props;
    }
    setProps() {
        if (this.props && this.slider) {
            this.slider.setProps(this.props);
        }
    }
    updateProps() {
        const props = merge_1.default({}, this.props);
        this.getProps();
        if (this.checkNeedUpdate(props)) {
            this.setProps();
        }
    }
    checkNeedUpdate(props) {
        const prev = JSON.stringify(props);
        const next = JSON.stringify(this.props);
        if (prev !== next) {
            return true;
        }
        return false;
    }
    onAfterChange(values) {
        if (!values || !this.props) {
            return;
        }
        const prev = JSON.stringify(orderBy_1.default(get_1.default(this.props, ['values'], []), [], ['asc']));
        const next = JSON.stringify(orderBy_1.default(values || [], [], ['asc']));
        if (next === prev) {
            return;
        }
        set_1.default(this.props, ['values'], values);
        jquery_1.default('.js-input_control', this.$sections).each((index, element) => {
            if (jquery_1.default(element) && jquery_1.default(element).data) {
                if (jquery_1.default(element).data('data')) {
                    const data = jquery_1.default(element).data('data');
                    const type = data?.type;
                    if (type === 'values') {
                        jquery_1.default('.js-input__input', element).val(values[index]);
                    }
                }
            }
        });
    }
    handleSectionClick(event) {
        const target = get_1.default(event, ['target']);
        const currentTarget = get_1.default(event, ['currentTarget']);
        if (target) {
            this.removeHandle(target, currentTarget);
            this.addHandle(target, currentTarget);
        }
    }
    handleSectionInput(event) {
        const target = get_1.default(event, ['target']);
        if (target && jquery_1.default(target).attr('type') === 'checkbox') {
            this.updateProps();
        }
    }
    handleSectionFocusout(event) {
        const target = get_1.default(event, ['target']);
        if (target &&
            ['number', 'text'].indexOf(jquery_1.default(target).attr('type') || '') !== -1) {
            this.updateProps();
        }
    }
    addHandle(target, currentTarget) {
        if (jquery_1.default(target).closest('.js-button_add').length) {
            const $items = this.getSectionItems(currentTarget);
            if ($items.length > 0) {
                const $lastItem = jquery_1.default($items.slice(-1));
                const $last = $lastItem.clone();
                $last.removeClass('section__item_first');
                const $inputControl = jquery_1.default('.js-input', $last);
                $inputControl.removeClass('input_first');
                let key = ($inputControl.data('key') || 0);
                key += 1;
                $inputControl.attr({ 'data-key': key });
                const $span = jquery_1.default('.js-input__section-key', $last);
                $span.text(`${key + 1}:`);
                const $input = jquery_1.default('.js-input__input', $last);
                $input.attr({ id: utils_1.uniqId });
                const max = get_1.default(this.props, ['max'], 0);
                const min = get_1.default(this.props, ['min'], 0);
                const value = parseFloat(String(jquery_1.default('.js-input__input', $lastItem).val())) +
                    (max - min) * 1e-1;
                if (!isUndefined_1.default(value) && !Number.isNaN(value)) {
                    $input.val(utils_1.ensureValueInRange(value, { max, min }));
                }
                $lastItem.after($last);
                this.updateProps();
            }
        }
    }
    removeHandle(target, currentTarget) {
        if (jquery_1.default(target).closest('.js-button_remove').length) {
            const $items = this.getSectionItems(currentTarget);
            if ($items.length > 1) {
                const $item = jquery_1.default(target).closest('.js-section__item_control');
                if ($item.length) {
                    $item.remove();
                    Example.updateHandles(currentTarget);
                    this.updateProps();
                }
            }
        }
    }
    processingSection(index, element) {
        jquery_1.default('.js-input', element).each(this.processingInput);
    }
    processingInput(index, element) {
        const { property, type } = (get_1.default(jquery_1.default(element).data(), ['data']) || {});
        const value = Example.prepareValue(element, property);
        this.prepareProp(value, type, property);
    }
    prepareProp(value, type, property) {
        if (!type || !property) {
            return;
        }
        if (property === 'values') {
            if (type === 'values' && !isUndefined_1.default(value)) {
                this.props = {
                    ...this.props,
                    values: [...(this.props?.values || []), value],
                };
            }
            else if (type === 'mark' && !isUndefined_1.default(value)) {
                this.props = {
                    ...this.props,
                    mark: {
                        ...(this.props?.mark || {}),
                        values: [...(this.props?.mark?.values || []), value],
                    },
                };
            }
        }
        else if ([
            'min',
            'max',
            'step',
            'disabled',
            'vertical',
            'reverse',
            'push',
            'precision',
            'indent',
        ].indexOf(property) !== -1) {
            this.props = {
                ...this.props,
                [property]: value,
            };
        }
        else {
            this.props = {
                ...this.props,
                [type]: {
                    ...(this.props || {})[type],
                    [property]: value,
                },
            };
        }
    }
    static prepareValue(element, property) {
        let value;
        if (!(element instanceof HTMLElement) || !trim_1.default(property)) {
            return undefined;
        }
        const $input = jquery_1.default('input', element);
        value = $input.val();
        if (isUndefined_1.default(value)) {
            return undefined;
        }
        switch (property) {
            case 'values':
            case 'min':
            case 'max':
            case 'step':
            case 'precision':
            case 'indent': {
                if (Number.isNaN(Number(value)) ||
                    Number.isNaN(parseFloat(String(value)))) {
                    return undefined;
                }
                return parseFloat(String(value));
            }
            case 'disabled':
            case 'vertical':
            case 'reverse':
            case 'push':
            case 'on':
            case 'dot':
            case 'always': {
                value = Boolean($input.prop('checked'));
                return value;
            }
            case 'classNames':
            case 'styles': {
                return Example.prepareArray(value);
            }
            case 'className':
            case 'wrapClassName': {
                if (!isString_1.default(value) || !trim_1.default(value)) {
                    return undefined;
                }
                return trim_1.default(value);
            }
            case 'style': {
                return Example.prepareObject(value);
            }
            case 'render': {
                return Example.prepareFunction(value);
            }
            default: {
                return undefined;
            }
        }
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, HTMLElement]),
    __metadata("design:returntype", void 0)
], Example.prototype, "initHandler", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], Example.prototype, "onAfterChange", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Example.prototype, "handleSectionClick", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Example.prototype, "handleSectionInput", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Example.prototype, "handleSectionFocusout", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, HTMLElement]),
    __metadata("design:returntype", void 0)
], Example.prototype, "processingSection", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, HTMLElement]),
    __metadata("design:returntype", void 0)
], Example.prototype, "processingInput", null);
function renderExample() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const example = new Example(this);
}
function renderComponent() {
    jquery_1.default('.js-example').each(renderExample);
}
jquery_1.default(renderComponent);
//# sourceMappingURL=index.js.map