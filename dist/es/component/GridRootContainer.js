import * as React from 'react';
import cx from 'classnames';
export class GridRootContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (React.createElement("div", { className: cx('ax-datagrid'), tabIndex: (-1), style: this.props.style, onWheel: e => {
                this.props.onFireEvent('wheel', e);
            }, onClick: e => {
                this.props.onFireEvent('click', e);
            }, onKeyDown: e => {
                this.props.onFireEvent('keydown', e);
            } }, this.props.children));
    }
}