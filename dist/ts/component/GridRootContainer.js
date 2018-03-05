"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const classnames_1 = __importDefault(require("classnames"));
class GridRootContainer extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement("div", { className: classnames_1.default('ax-datagrid'), tabIndex: (-1), style: this.props.style, onWheel: e => {
                this.props.onFireEvent('wheel', e);
            }, onKeyDown: e => {
                this.props.onFireEvent('keydown', e);
            }, onKeyUp: e => {
                this.props.onFireEvent('keyup', e);
            }, onMouseDown: e => {
                this.props.onFireEvent('mousedown', e);
            }, onMouseUp: e => {
                this.props.onFireEvent('mouseup', e);
            }, onClick: e => {
                this.props.onFireEvent('click', e);
            } }, this.props.children));
    }
}
exports.GridRootContainer = GridRootContainer;
//# sourceMappingURL=GridRootContainer.js.map