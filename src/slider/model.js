"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const merge_1 = __importDefault(require("lodash.merge"));
const pubsub_1 = __importDefault(require("../helpers/pubsub"));
const utils_1 = require("../helpers/utils");
class Model extends pubsub_1.default {
    constructor(props) {
        super();
        this.props = props;
    }
    getProps() {
        return this.props;
    }
    setProps(props) {
        this.props = utils_1.prepareData(props, this.getProps());
        this.publish('setPropsForView', this.props);
    }
    onChange(options) {
        const { disabled, vertical } = this.props;
        if (disabled) {
            return;
        }
        const { coordinateX, coordinateY, start, length, action = 'onChange', } = options;
        const { index } = this.props;
        let readyIndex = index;
        if (isUndefined_1.default(readyIndex) || readyIndex < 0) {
            readyIndex = utils_1.getNearestIndex({
                coordinateX,
                coordinateY,
                start,
                length,
                props: this.props,
            });
            this.setIndex({ index: readyIndex });
        }
        const position = utils_1.getPosition({
            vertical,
            coordinateX,
            coordinateY,
        });
        const { values: previousValues } = this.props;
        const previousValue = previousValues[readyIndex];
        const nextValue = utils_1.calcValueByPos({
            position,
            start,
            length,
            props: this.props,
            index: readyIndex,
        });
        if (previousValue !== nextValue) {
            const nextValues = [...previousValues];
            nextValues[readyIndex] = nextValue;
            this.setProps(merge_1.default({}, this.props, { values: nextValues }));
            if (this.props && action in this.props) {
                let onAction;
                if (action === 'onChange') {
                    onAction = this.props?.[action];
                }
                else if (action === 'onBeforeChange') {
                    onAction = this.props?.[action];
                }
                else if (action === 'onAfterChange') {
                    onAction = this.props?.[action];
                }
                if (nextValues && onAction) {
                    onAction(nextValues);
                }
            }
        }
    }
    onBeforeChange({ index }) {
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        this.setIndex({ index });
        const { values } = this.props;
        const onBeforeChange = this.props
            ?.onBeforeChange;
        if (values && onBeforeChange) {
            onBeforeChange(values);
        }
    }
    onAfterChange() {
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        this.setProps();
        const { values } = this.props;
        // eslint-disable-next-line prettier/prettier
        const onAfterChange = this.props
            ?.onAfterChange;
        if (values && onAfterChange) {
            onAfterChange(values);
        }
    }
    setIndex({ index }) {
        const { index: previousIndex, disabled } = this.props;
        if (disabled) {
            return;
        }
        if (previousIndex !== index) {
            const props = merge_1.default({}, this.props, { index });
            this.setProps(props);
        }
    }
}
exports.default = Model;
//# sourceMappingURL=model.js.map